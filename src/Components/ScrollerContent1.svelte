<script>
  import * as d3 from 'd3';
  import Scroller from "@sveltejs/svelte-scroller";

  export let data;
  export let selected;

  let index, offset, progress, count, selectedD;

  console.log(data)
  $: selectedD = data.filter(d => d.id === selected)[0]

  const format = d3.format(',')

  const margin = { t: 25, r: 0, b: 50, l: 50 }
  const width = window.innerWidth * 0.9 * 0.6;
  const maxHeight = window.innerHeight - 300;
  let height = width / 3 > maxHeight ? maxHeight : width / 3;

  let innerHeight = height - margin.t - margin.b;
  const innerWidth = width - margin.l - margin.r;

  let domain = [...Array(42).keys()].map((d) => d + 1981);
  let xScale = d3.scaleBand()
        .domain(domain)
        .range([margin.l, width - margin.r])
        .paddingInner(0.5);

  let yScale = d3.scaleLinear()
      .domain([0, 13])
      .range([height / 2 - margin.b, margin.t]);

  let aScale = d3.scalePow()
      .exponent(1)
      .domain([1982, 2021])
      .range([0, 1])

  let rScale= d3.scaleSqrt()
      .domain([0, 28])
      .range([3, 10])

  $: if (index < 3) {
    height = width / 3 > maxHeight ? maxHeight : width / 3;
    innerHeight = height - margin.t - margin.b;

    domain = [...Array(42).keys()].map((d) => d + 1981);
    xScale = d3.scaleBand()
          .domain(domain)
          .range([margin.l, width - margin.r])
          .paddingInner(0.5);

    yScale = d3.scaleLinear()
        .domain([0, 13])
        .range([height - margin.b, margin.t]);

    aScale = d3.scalePow()
      .exponent(1)
      .domain([1982, 2021])
      .range([0, 1])
  } 
  else if (index >= 3) {
    height = width / 2 > maxHeight ? maxHeight : width / 2;
    innerHeight = height - margin.t - margin.b;

    let parseTime = d3.timeParse("%m/%d/%y")
    xScale = d3.scaleTime()
      .domain([parseTime("01/01/81"), parseTime("12/31/21")])
      .range([margin.l, width - margin.r]);

    yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.total_words)])
      .range([height - margin.b, margin.t]);

    aScale = d3.scaleLinear()
      .domain([0, 28])
      .range([0, 1])
  }

</script>

<Scroller top="{0.3}" bottom="{0.9}" bind:index bind:offset bind:progress bind:count>
<div slot="background" class="background">
  <svg {width} {height}>
    {#if index == 0}
      <g>
        <text class="axis-label"
              transform={`translate(30, ${innerHeight / 2 + 20}) rotate(-90)`}
        >Count</text>
        {#each data as d}
            <circle
              cx="{xScale(+d.year)}"
              cy="{yScale(d.count_by_year)}"
              r="{xScale.bandwidth() - height / 80}"
              stroke="#eeeeee"
              stroke-width="0.4"
              fill="#eeeeee"
            />
        {/each}
        <text class="axis-label"
              x={innerWidth / 2 + 40} y={innerHeight + 35}>Year</text>
      </g>
    {:else if index == 1}
      <g>
        <text class="axis-label"
        transform={`translate(30, ${innerHeight / 2 + 20}) rotate(-90)`}>Count</text>
          {#each data as d}
            <circle
              cx="{xScale(+d.year)}"
              cy="{yScale(d.count_by_year)}"
              r="{xScale.bandwidth() - height / 80}"
              stroke="#eeeeee"
              stroke-width="0.4"
              fill="{d.id === selected ? "orange" : "#eeeeee"}"
              style="opacity: {d.id === selected ? 1 : 0.1}"
            />
          {/each}
        <text class="axis-label"
        x={innerWidth / 2 + 40} y={innerHeight + 35}>Year</text>
      </g>
    {:else if index == 2}
      <g>
        <text class="axis-label"
        transform={`translate(30, ${innerHeight / 2 + 20}) rotate(-90)`}>Count</text>
          {#each data as d}
            <circle
              cx="{xScale(+d.year)}"
              cy="{yScale(d.count_by_year)}"
              r="{xScale.bandwidth() - height / 80}"
              stroke="#eeeeee"
              stroke-width="0.4"
              fill="{d.total_front_page == "NA" 
                      ? "#222222"
                      : "#eeeeee"}"
              style="opacity: {d.total_front_page == "NA" ? 0.1 : 
                                d.total_articles == 0 ? 1 : 0.1}"
            />
          {/each}
        <text class="axis-label"
        x={innerWidth / 2 + 40} y={innerHeight + 35}>Year</text>
      </g>
    {:else if index == 3}
      <g>
        <text class="axis-label"
        transform={`translate(30, ${innerHeight / 2 + 60}) rotate(-90)`}>Number of words</text>
        {#each data as d}
        <rect
          x="{xScale(d.shooting_date)}"
          y="{yScale(d.total_words)}"
          width="1"
          height="{height - yScale(d.total_words) - margin.b}"
          fill="#eeeeee"
          fill-opacity="0.8"
        />
        {/each}
        <text class="axis-label"
        x={innerWidth / 2 + 40} y={innerHeight + 45}>Date</text>
      </g>
    {:else if index == 4}
      <g>
        <text class="axis-label"
        transform={`translate(30, ${innerHeight / 2 + 60}) rotate(-90)`}>Number of words</text>
          {#each data as d}
            <rect
              x="{xScale(d.shooting_date)}"
              y="{yScale(d.total_words)}"
              width="1"
              height="{height - yScale(d.total_words) - margin.b}"
              fill="{d.id === selected ? "orange" : "#eeeeee"}"
              fill-opacity="{d.id === 113 || d.id === selected ? 1 : 0.1}"
            />
          {/each}
        <text class="axis-label"
        x={innerWidth / 2 + 40} y={innerHeight + 45}>Date</text>
      </g>
    {:else if index == 5}
      <g>
        <text class="axis-label"
        transform={`translate(30, ${innerHeight / 2 + 60}) rotate(-90)`}>Number of words</text>
        {#each data as d}
          <rect
            x="{xScale(d.shooting_date)}"
            y="{yScale(d.total_words)}"
            width="1"
            height="{height - yScale(d.total_words) - margin.b}"
            fill="#eeeeee"
            fill-opacity={d.if_made_on_front === "FALSE" ? 0.1 : 1}
          />
          <circle
            cx="{xScale(d.shooting_date)}"
            cy="{yScale(d.total_words)}"
            r="{rScale(d.total_front_page)}"
            stroke="#eeeeee"
            stroke-width="0.4"
            fill="{d.if_made_on_front == "FALSE" ? "#222222" : "#eeeeee"}"
            fill-opacity="{d.made_front_count == "FALSE" ? 0 : 0.8}"
            stroke-opacity="{d.made_front_count == "NA" ? 0 : 1}"
          />
        {/each}
        <text class="axis-label"
        x={innerWidth / 2 + 40} y={innerHeight + 45}>Date</text>
      </g>
    {:else if index == 6}
      <g>
        <text class="axis-label"
        transform={`translate(30, ${innerHeight / 2 + 60}) rotate(-90)`}>Number of words</text>
        {#each data as d}
          <rect
            x="{xScale(d.shooting_date)}"
            y="{yScale(d.total_words)}"
            width="1"
            height="{height - yScale(d.total_words) - margin.b}"
            fill="{d.id === selected ? "orange" : "#eeeeee"}"
            style="opacity: {d.id === 97 || d.id === selected ? 1 : 0.1}"
          />
          <circle
            cx="{xScale(d.shooting_date)}"
            cy="{yScale(d.total_words)}"
            r="{rScale(d.total_front_page)}"
            stroke="{d.id === selected ? "orange" : "#eeeeee"}"
            stroke-width="0.4"
            fill="{d.if_made_on_front == "FALSE" ? "#222222" : d.id === selected ? "orange" : "#eeeeee"}"
            style="opacity: {d.id === 97 || d.id === selected ? 1 : 0.05}"
          />
        {/each}
        <text class="axis-label"
        x={innerWidth / 2 + 40} y={innerHeight + 45}>Date</text>
      </g>
    {/if}
  </svg>
</div>

<div slot="foreground" class="foreground">
  <section data-section="0">
    <p>
      Mass shootings have been more frequent in recent years. In 2018, there were 12 incidents including the high school shooting in Parkland, Fla. that killed 17 students and adults. There were 11 in 2017, including the massacre in Las Vegas, Nevada that killed 58 concertgoers and injured 546, by far the deadliest mass shooting in U.S. history.
    </p>
  </section>
  <section data-section="1">
    <p>
      The shooting you remember the most, <span class="selected">{selectedD.case}</span>, happened in {selectedD.year} in {selectedD.city}, {selectedD.state}. It was one of the XXX shootings that year.
    </p>
  </section>
  <section data-section="2">
    <p>
      This project found no articles in The New York Times print edition about these three shootings: <span class="highlighted">Atlantis Plastics shooting</span> in Henderson, Kentucky in 2008 where six people were killed by an employee at the factory. Another is the <span class="highlighted">Trestle Trail bridge shooting</span> in Menasha, Wisconsin in 2015, and the <span class="highlighted">hotel bar shooting</span> in State College, Pennsylvania in 2019.
    </p>
  </section>
  <section data-section="3">
    <p>
      This chart shows the number of total words in NYT articles about 94 shootings since 1982. Increasingly widely-reported shootings have happened in recent years.
    </p>
  </section>
  <section data-section="4">
    {#if selectedD.id === 113}
      <p>
        The <span class="selected">{selectedD.case}</span> in Texas in 2019, where a gunman killed 22, injured 26 in a crowded Walmart store, attracted the most number of words (about 128,000 words) for the past four decades. Many of this attack’s reports were linked to the shooter’s motives, white nationalism and hate against immigrants.
      </p>    
      <p>It was also the one you remembered the most.</p>
    {:else}
      <p>
        The <span class="highlighted">one in El Paso, Texas in 2019</span>, where a gunman killed 22, injured 26 in a crowded Walmart store, attracted the most number of words (about 128,000 words) for the past four decades. Many of this attack’s reports were linked to the shooter’s motives, white nationalism and hate against immigrants.
      </p>    
      <p>
        The shooting you chose, <span class="selected">{selectedD.case}</span>, was covered with a total of {format(selectedD.total_words)} words.
      </p>
    {/if}
  </section>
  <section data-section="5">
    <p>
      Of all shootings that had at least one article, 52 made it to the front page while 38 didn’t.
    </p>
  </section>
  <section data-section="6">
      {#if selectedD.id === 97}
      <p>
        The shooting that generated the most articles on the front page was the one you chose, <span class="selected">Marjory Stoneman Douglas High School shooting</span> in Parkland, Florida in 2018, with a total of 28 articles for the two-week period. 
      </p>
      {:else}
        <p>
          The shooting that generated the most articles on the front page was <span class="highlighted">Marjory Stoneman Douglas High School shooting</span> in Parkland, Florida in 2018, with a total of 28 articles for the two-week period. 
        </p>
        <p>
          The shooting you chose, <span class="selected">{selectedD.case}</span>, {selectedD.total_front_page == 0 ? "didn't make it to the front page" : `had ${selectedD.total_front_page} article${selectedD.total_front_page == 1 ? "" : "s"} on the front page`}.
        </p>
      {/if}
  </section>
</div>
</Scroller>

<style>
  section {
    min-height: 80vh;
    margin: auto 0;
    padding: 5em 3em;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .background {
    width: 60%;
    margin: 0 auto 0 0;
  }

  .foreground {
    width: 40%;
    margin: 0 0 0 auto;
  }

  .axis-label {
    fill: #eeeeee;
    font-size: 12px;
    font-family: 'Fira Sans Condensed', sans-serif;
    opacity: 0.5;
    font-style: italic
  }

  span {
    padding: 0 0.3em;
  }

  .selected {
    color: white;
    background: rgba(255, 165, 0, 0.8);
  }

  .highlighted {
    color: #222222;
    background: rgb(238, 238, 238);
  }
</style>