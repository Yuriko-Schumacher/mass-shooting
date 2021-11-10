<script>
  import * as d3 from 'd3';
  import Scroller from "@sveltejs/svelte-scroller";

  export let data;
  export let selected;

  let index, offset, progress, count, selectedD;

  console.log(data)
  $: selectedD = data.filter(d => d.id === selected)[0]

  const margin = { t: 25, r: 0, b: 50, l: 50 }
  const width = 550;
  let height = 250;

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
      .range([0, 10])

  $: if (index < 5) {
    height = 250
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
  // else if (index == 6) {
  //   domain = [...Array(42).keys()].map((d) => d + 1981);
  //   xScale = d3.scaleBand()
  //         .domain(domain)
  //         .range([margin.l, width - margin.r])
  //         .paddingInner(0.5);

  //   yScale = d3.scaleLinear()
  //       .domain([0, 13])
  //       .range([height - margin.b, margin.t]);
  // } 
  else if (index >= 5) {
    height = 400
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

<Scroller top="{0.3}" bottom="{0.7}" bind:index bind:offset bind:progress bind:count>
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
              r="3"
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
              r="3"
              stroke="{d.id === selected ? "orange" : "#eeeeee"}"
              stroke-width="0.4"
              fill="{d.id === selected ? "orange" : "#eeeeee"}"
              fill-opacity="{aScale(+d.year)}"
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
              r="3"
              stroke="#eeeeee"
              stroke-width="0.4"
              fill="#eeeeee"
              fill-opacity="{aScale(+d.year)}"
            />
          {/each}
        <text class="axis-label"
        x={innerWidth / 2 + 40} y={innerHeight + 35}>Year</text>
      </g>
    {:else if index == 3}
      <g>
        <text class="axis-label"
        transform={`translate(30, ${innerHeight / 2 + 20}) rotate(-90)`}>Count</text>
        {#each data as d}
            <circle
              cx="{xScale(+d.year)}"
              cy="{yScale(d.count_by_year)}"
              r="3"
              stroke="#eeeeee"
              stroke-width="0.4"
              fill="{d.total_front_page == "NA" 
              ? "#222222"
              : "#eeeeee"}"
            />
        {/each}
        <text class="axis-label"
        x={innerWidth / 2 + 40} y={innerHeight + 35}>Year</text>
      </g>
    {:else if index == 4}
      <g>
        <text class="axis-label"
        transform={`translate(30, ${innerHeight / 2 + 20}) rotate(-90)`}>Count</text>
        {#each data as d}
          <circle
            cx="{xScale(+d.year)}"
            cy="{yScale(d.count_by_year)}"
            r="3"
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
    {:else if index == 5}
      <!-- {#each data as d}
        <circle
          cx="{d.if_made_on_front == "FALSE"
                ? xScale(1997 - Math.floor((d.made_front_count - 1) / 12))
                : xScale(2003 + Math.floor((d.made_front_count - 1) / 12))}"
          cy="{yScale((d.made_front_count - 1) % 12)}"
          r="3"
          stroke="#eeeeee"
          stroke-width="0.4"
          fill="{d.if_made_on_front == "FALSE" ? "#222222" : "#eeeeee"}"
          fill-opacity="{d.made_front_count == "NA" ? 0 : 1}"
          stroke-opacity="{d.made_front_count == "NA" ? 0 : 1}"
        />
      {/each} -->
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
        <!-- {#each data as d}
          <circle
            cx="{xScale(d.shooting_date)}"
            cy="{yScale(d.total_words)}"
            r="3"
            stroke="#eeeeee"
            stroke-width="0.4"
            fill="#eeeeee"
            fill-opacity="{d.made_front_count == "NA" ? 0 : 0.8}"
            stroke-opacity="{d.made_front_count == "NA" ? 0 : 1}"
          />
        {/each} -->
        <text class="axis-label"
        x={innerWidth / 2 + 40} y={innerHeight + 45}>Date</text>
      </g>
    {:else if index == 6}
      <!-- {#each data as d}
        <circle
          cx="{d.if_made_on_front == "FALSE"
                ? xScale(1997 - Math.floor((d.made_front_count - 1) / 12))
                : xScale(2003 + Math.floor((d.made_front_count - 1) / 12))}"
          cy="{yScale((d.made_front_count - 1) % 12)}"
          r="3"
          stroke="#eeeeee"
          stroke-width="{d.id === selected ? 3 : 0.4}"
          fill="#eeeeee"
          fill-opacity="{d.made_front_count == "NA" ? 0 : aScale(d.total_front_page)}"
          stroke-opacity="{d.made_front_count == "NA" ? 0 : 1}"
        />
      {/each} -->
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
          <!-- {#each data as d}
            <circle
              cx="{xScale(d.shooting_date)}"
              cy="{yScale(d.total_words)}"
              r="3"
              stroke="#eeeeee"
              stroke-width="0.4"
              fill="#eeeeee"
              fill-opacity="{d.made_front_count == "NA" ? 0 : d.id === 113 || d.id === selected ? 1 : 0.1}"
              stroke-opacity="{d.made_front_count == "NA" ? 0 : d.id === 113 || d.id === selected ? 1 : 0.1}"
            />
          {/each} -->
        <text class="axis-label"
        x={innerWidth / 2 + 40} y={innerHeight + 45}>Date</text>
      </g>
    {:else if index == 7}
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
        {/each}
        {#each data as d}
          <circle
            cx="{xScale(d.shooting_date)}"
            cy="{yScale(d.total_words)}"
            r="3"
            stroke="#eeeeee"
            stroke-width="0.4"
            fill="{d.if_made_on_front == "FALSE" ? "#222222" : "#eeeeee"}"
            fill-opacity="{d.made_front_count == "NA" ? 0 : 0.8}"
            stroke-opacity="{d.made_front_count == "NA" ? 0 : 1}"
          />
        {/each}
        <text class="axis-label"
        x={innerWidth / 2 + 40} y={innerHeight + 45}>Date</text>
      </g>
    {:else if index == 8}
      <g>
        <text class="axis-label"
        transform={`translate(30, ${innerHeight / 2 + 60}) rotate(-90)`}>Number of words</text>
        {#each data as d}
          <rect
            x="{xScale(d.shooting_date)}"
            y="{yScale(d.total_words)}"
            width="1"
            height="{height - yScale(d.total_words) - margin.b}"
            fill="{d.if_made_on_front == "FALSE" ? "#222222" : d.id === selected ? "orange" : "#eeeeee"}"
            style="opacity: {d.id === 97 || d.id === selected ? 1 : 0.1}"
          />
        {/each}
        {#each data as d}
          <circle
            cx="{xScale(d.shooting_date)}"
            cy="{yScale(d.total_words)}"
            r="{rScale(d.total_front_page)}"
            stroke="{d.if_made_on_front == "FALSE" ? "#222222" : d.id === selected ? "orange" : "#eeeeee"}"
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
      In the U.S., there have been at least 124 mass shootings since 1982, according to the Mother Jones’ mass shooting database. 
    </p>
    <p>
      It defines a mass shooting as “indiscriminate rampages in public places resulting in four or more victims killed” and excludes “shootings stemming from more conventionally motivated crimes such as armed robbery or gang violence.”
    </p>
    <p>
      The definition of a mass shooting varies between research institutions and media outlets. I’m using Mother Jones’ database because their definition allows more in-depth investigation about a distinct incident.
    </p>
  </section>
  <section data-section="1">
    <p>
      Mass shootings have been more frequent in recent years. In 2018, there were 12 incidents including the high school shooting in Parkland, Fla. that killed 17 students and adults. There were 11 in 2017, including the massacre in Las Vegas, Nevada that killed 58 concertgoers and injured 546, by far the deadliest mass shooting in U.S. history.
    </p>
    <p>
      The shooting you thought of first, <span>{selectedD.case}</span>, happened in {selectedD.year} in {selectedD.city}, {selectedD.state}. {selectedD.fatalities} people were killed and {selectedD.injured} others were injured.
    </p>
  </section>
  <section data-section="2">
    <p>
      I tracked coverage about each incident in the print edition of The New York Times since 1982. In order to compare the amount of coverage over time, I counted the coverage for a two weeks period for each shooting.
    </p>
    <p>
      Beginning on the day the incident happened and for the subsequent two weeks, I tallied the number of articles about the shooting and the ones in which that shooting was mentioned, as well as the number of words of articles about the shooting and where they appeared in the paper.
    </p>
    <p>
      These metrics allowed me to measure media attention and compare between shootings.
    </p>
  </section>
  <section data-section="3">
    <p>
      Out of 124 shootings, as of November 8th, I completed filtering 94 shootings from 1982 to 2015, 2019 and 2020. In missing years, I also covered one in Orlando in 2016, Las Vegas in 2017, Parkland in 2018.
    </p>
  </section>
  <section data-section="4">
    <p>
      This project found no articles in The New York Times print edition about these three shootings: Atlantis Plastics shooting in Henderson, Kentucky in 2008 where six people were killed by an employee at the factory. Another is Trestle Trail bridge shooting in Menasha, Wisconsin in 2015 and a hotel bar shooting in State College, Pennsylvania in 2019.
    </p>
  </section>
  <section data-section="5">
    <p>
      This chart shows the number of total words in NYT articles about 94 shootings since 1982. Increasingly widely-reported shootings have happened in recent years.
    </p>
  </section>
  <section data-section="6">
    <p>
      The one in El Paso, Texas in 2019, where a gunman killed 22, injured 26 in a crowded Walmart store, attracted the most number of words (about 128,000 words) for the past four decades. Many of this attack’s reports were linked to the shooter’s motives, white nationalism and hate against immigrants.
    </p>    
    <p>
      The shooting you chose, <span>{selectedD.case}</span>, was covered with a total of {selectedD.total_words} words.
    </p>
  </section>
  <section data-section="7">
    <p>
      Of all shootings that had at least one article, 52 made it to the front page while 38 didn’t.
    </p>
  </section>
  <section data-section="8">
      {#if selectedD.id === 97}
      <p>
        The shooting that generated the most articles on the front page was the one you chose, <span>Marjory Stoneman Douglas High School shooting</span> in Parkland, Florida in 2018, with a total of 28 articles for the two-week period. 
      </p>
      {:else}
        <p>
          The shooting that generated the most articles on the front page was Marjory Stoneman Douglas High School shooting in Parkland, Florida in 2018, with a total of 28 articles for the two-week period. 
        </p>
        <p>
          The shooting you chose, <span>{selectedD.case}</span>, {selectedD.total_front_page == 0 ? "didn't make it to the front page" : `had a total of ${selectedD.total_front_page} articles on the front page`}.
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
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    opacity: 0.5;
    font-style: italic
  }

  span {
    color: white;
    background: rgba(255, 165, 0, 0.8);
    padding: 0 0.3em;
  }
</style>