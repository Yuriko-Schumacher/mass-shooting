<script>
  import * as d3 from 'd3';
  import Scroller from "@sveltejs/svelte-scroller";

  export let data;
  export let selected;

  let index, offset, progress, count, selectedD;
  let filteredD = data.filter(d => d.total_front_page !== "NA")

  $: selectedD = data.filter(d => d.id === selected)[0]

  const format = d3.format(",");

  const margin = { t: 75, r: 150, b: 100, l: 70 }
  const width = window.innerWidth * 0.9 * 0.6;
  const maxHeight = window.innerHeight - 200;
  const chartTitle = "Number of fatal victims and total number of words"
  let height = width > maxHeight ? maxHeight : width;
  let hlineNumbers = [...Array(13).keys()].map((el) => el * 10000);
  let vlineNumbers = [...Array(60).keys()];
  let vlineNumbers2 = [...Array(12).keys()].map(el => el * 5 + 5)

  let xScale = d3.scaleLinear()
		.domain([0, d3.max(filteredD, (d) => d.fatalities) + 1])
		.range([margin.l, width - margin.r]);

  let yScale = d3.scaleLinear()
		.domain(d3.extent(filteredD, (d) => d.total_words))
		.range([height - margin.b, margin.t]);

</script>

<Scroller top="{0.2}" bottom="{1}" bind:index bind:offset bind:progress bind:count>
<div slot="background" class="background">
  <svg {width} {height}>
    <g class="chart-title">
      <text transform="translate(0, 30)">
        {chartTitle}
      </text>
    </g>
    {#each hlineNumbers as n}
    <line 
      x1="{xScale(0)}"
      y1="{yScale(n)}"
      x2="{xScale(60)}"
      y2="{yScale(n)}"
      stroke="gray"
      stroke-opacity=0.5
      stroke-width=0.5
    />
    <text
      class="axis-ticks"
      x="{xScale(0)}"
      y="{yScale(n) + 5}"
    >{format(n)}
    </text>
    {/each}
    {#each vlineNumbers as n}
    <line 
      x1="{xScale(n)}"
      y1="{yScale(0)}"
      x2="{xScale(n)}"
      y2="{yScale(127966)}"
      stroke="gray"
      stroke-opacity=0.5
      stroke-width=0.3
    />
    {/each}
    {#each vlineNumbers2 as n}
    <text
      class="axis-ticks"
      x="{xScale(n)}"
      y="{yScale(0) + 15}"
    >{n}
    </text>
    <line 
    x1="{xScale(n)}"
    y1="{yScale(0)}"
    x2="{xScale(n)}"
    y2="{yScale(127966)}"
    stroke="gray"
    stroke-opacity=0.8
    stroke-width=0.5
  />
    {/each}
    {#if index == 0}
      <g>
        <text class="axis-label"
              transform={`translate(20, ${height / 2 + 50}) rotate(-90)`}
        >Total number of words</text>
        {#each filteredD as d}
        <circle
          cx="{xScale(d.fatalities)}"
          cy="{yScale(d.total_words)}"
          r="3"
          stroke="#eeeeee"
          stroke-width="0.4"
          fill="#eeeeee"
          fill-opacity="0.7"
        />
        <text
          class="label"
          x="{d.fatalities > 40
            ? xScale(d.fatalities) - 65
            : xScale(d.fatalities) + 10}"
          y="{d.city == "Dayton" ? yScale(d.total_words) + 15 : yScale(d.total_words) + 5}"
          style="opacity: {d.total_words > 50000 ? 0.3 : 0}"
        >{d.city}</text>
        {/each}
        <text class="axis-label"
        x={width / 2 - 50} y={height - margin.b + 45}>Total fatal victims</text>
      </g>
    {:else if index == 1}
      <g>
        <text class="axis-label"
              transform={`translate(20, ${height / 2 + 50}) rotate(-90)`}
        >Total number of words</text>
        {#each filteredD as d}
        <circle
          cx="{xScale(d.fatalities)}"
          cy="{yScale(d.total_words)}"
          r="3"
          fill="#eeeeee"
          style="opacity: {d.id === 91 ? 1 : 0.1}"
        />
        <text
          class="label"
          x="{d.fatalities > 40
            ? xScale(d.fatalities) - 65
            : xScale(d.fatalities) + 10}"
          y="{d.city == "Dayton" ? yScale(d.total_words) + 15 : yScale(d.total_words) + 5}"
          style="opacity: {d.total_words < 50000 ? 0 : d.id == 91 ? 0.3 : 0}"
        >{d.city}</text>
        {/each}
        <text class="axis-label"
        x={width / 2 - 50} y={height - margin.b + 45}>Total fatal victims</text>
      </g>
    {:else if index == 2}
      <g>
        <text class="axis-label"
              transform={`translate(20, ${height / 2 + 50}) rotate(-90)`}
        >Total number of words</text>
        {#each filteredD as d}
        <circle
          cx="{xScale(d.fatalities)}"
          cy="{yScale(d.total_words)}"
          r="3"
          fill="#eeeeee"
          style="opacity: {d.id === 91 || d.id === 81 || d.id === 42 ? 1 : 0.1}"
        />
        <text
          class="label"
          x="{d.fatalities > 40
            ? xScale(d.fatalities) - 65
            : xScale(d.fatalities) + 10}"
          y="{d.city == "Dayton" ? yScale(d.total_words) + 15 : yScale(d.total_words) + 5}"
          style="opacity: {d.total_words < 50000 ? 0 : d.id === 91 || d.id === 81 || d.id === 42 ? 0.3 : 0}"
        >{d.city}</text>
        {/each}
        <text class="axis-label"
        x={width / 2 - 50} y={height - margin.b + 45}>Total fatal victims</text>
      </g>
    {:else if index == 3}
      <g>
        <text class="axis-label"
              transform={`translate(20, ${height / 2 + 50}) rotate(-90)`}
        >Total number of words</text>
        {#each filteredD as d}
        <circle
          cx="{xScale(d.fatalities)}"
          cy="{yScale(d.total_words)}"
          r="3"
          fill="#eeeeee"
          style="opacity: {d.city == "Newtown" || d.city == "El Paso" || d.city == "Parkland" || d.city == "Littleton" || d.city == "Charleston" || d.city == "San Bernardino" || d.city == "Dayton" || d.city == "Tucson" ? 1 : 0.1}"
        />
        <text
          class="label"
          x="{d.fatalities > 40
            ? xScale(d.fatalities) - 65
            : xScale(d.fatalities) + 10}"
          y="{d.city == "Dayton" ? yScale(d.total_words) + 15 : yScale(d.total_words) + 5}"
          style="opacity: {d.total_words < 50000 ? 0 : d.city == "Newtown" || d.city == "El Paso" || d.city == "Parkland" || d.city == "Littleton" || d.city == "Charleston" || d.city == "San Bernardino" || d.city == "Dayton" || d.city == "Tucson" ? 0.3 : 0}"
        >{d.city}</text>
        {/each}
        <text class="axis-label"
        x={width / 2 - 50} y={height - margin.b + 45}>Total fatal victims</text>
      </g>
    {:else if index == 4}
      <g>
        <text class="axis-label"
              transform={`translate(20, ${height / 2 + 50}) rotate(-90)`}
        >Total number of words</text>
        <line
          x1={xScale(1)}
          y1={yScale(0)}
          x2={xScale(59)}
          y2={yScale(130000)}
          stroke="#eeeeee"
          stroke-width="1"
        />
        {#each filteredD as d}
        <circle
          cx="{xScale(d.fatalities)}"
          cy="{yScale(d.total_words)}"
          r="3"
          fill="{d.id === selected ? "orange" : "#eeeeee"}"
          style="opacity: {d.id == selected ? 1 : 0.1}"
        />
        <text
          class="label"
          x="{d.fatalities > 40
            ? xScale(d.fatalities) - 65
            : xScale(d.fatalities) + 10}"
          y="{d.city == "Dayton" ? yScale(d.total_words) + 15 : yScale(d.total_words) + 5}"
          style="opacity: {d.id == selected ? 1 : d.total_words < 50000 ? 0 : 0.1}"
        >{d.city}</text>
        {/each}
        <text class="axis-label"
        x={width / 2 - 50} y={height - margin.b + 45}>Total fatal victims</text>
      </g>
    {/if}
  </svg>
</div>

<div slot="foreground" class="foreground">
  <section data-section="0">
    <p>
      Not surprisingly, when there are more victims, the amount of coverage increases.
    </p>
  </section>
  <section data-section="1">
    <p>
      The one in Las Vegas (58 fatalities, 74,555 words) had by far the most people killed and injured.
    </p>
  </section>
  <section data-section="2">
    <p>
      Compared to other shootings, Las Vegas had less coverage. The Orlando nightclub massacre had nine fewer people killed (49 fatalities), and yet generated about 50,000 more words (124,798 words).
    </p>
    <p>
      The same was true of the Virginia Tech massacre in Blacksburg (32 fatalities, about 60,000 words). These seem underreported for the number of people killed.
    </p>
  </section>
  <section data-section="3">
    <p>
      On the other hand, these shootings generated more coverage, considering the number of victims, even more than Orlando.
    </p>
    <p>
      They include the Sandy Hook Elementary School massacre in Newtown (27 fatalities, 106,800 words), Columbine High School shooting (13 fatalities, 94,400 words) in Littleton, and those in El Paso, Parkland, Tucson.
    </p>
  </section>
  <section data-section="4">
    <p>
      Given the number of victims, those above the line were reported more, while those below were reported less, compared to other shootings.
    </p>
    <p>
      The shooting you chose, <span>{selectedD.case}</span>, had a total of {selectedD.fatalities} fatalities and generated {format(selectedD.total_words)} words. It was {selectedD.total_words / selectedD.fatalities > 130000 / 58 ? "above" : "below"} the line.
    </p>
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

  .axis-label, .label {
    fill: #eeeeee;
    font-size: 12px;
    font-family: 'Fira Sans Condensed', sans-serif;
  }

  .axis-label {
    opacity: 0.5;
    font-size: 16px;
    font-style: italic
  }

  .axis-ticks {
    fill: #eeeeee;
    font-size: 12px;
    font-family: 'Fira Sans Condensed', sans-serif;
    opacity: 0.8;
    text-anchor: end;
  }

  span {
    color: white;
    background: rgba(255, 165, 0, 0.8);
    padding: 0 0.3em;
  }
</style>