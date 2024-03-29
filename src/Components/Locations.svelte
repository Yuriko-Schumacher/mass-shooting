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
  const chartTitle = "Number of fatal victims and total number of words, by location"
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
    >{n}</text>
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
    <!-- SCHOOL -->
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
          style="opacity: {d.location_new === "School" ? 1 : 0.1}"
        />
        <text
          class="label"
          x="{d.fatalities > 40
            ? xScale(d.fatalities) - 65
            : xScale(d.fatalities) + 10}"
          y="{d.city == "Dayton" ? yScale(d.total_words) + 15 : yScale(d.total_words) + 5}"
          style="opacity: {d.location_new === "School" && (d.total_words > 10000 || d.fatalities > 6) ? 0.3 : 0}"
        >{d.city}</text>
        {/each}
        <text class="axis-label"
        x={width / 2 - 50} y={height - margin.b + 45}>Total fatal victims</text>
      </g>
    <!-- WORKPLACE -->
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
          style="opacity: {d.location_new === "Workplace" ? 1 : 0.1}"
        />
        <text
          class="label"
          x="{d.fatalities > 40
            ? xScale(d.fatalities) - 65
            : xScale(d.fatalities) + 10}"
          y="{d.city == "Dayton" ? yScale(d.total_words) + 15 : yScale(d.total_words) + 5}"
          style="opacity: {d.location_new === "Workplace" && (d.total_words > 10000 || d.fatalities > 9) ? 0.3 : 0}"
        >{d.city}</text>
        {/each}
        <text class="axis-label"
        x={width / 2 - 50} y={height - margin.b + 45}>Total fatal victims</text>
      </g>
    <!-- RETAIL/RESTAURANT/BAR/NIGHTCLUB -->
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
          style="opacity: {d.location_new === "Restaurant/bar/nightclub" || d.location_new === "Retail" ? 1 : 0.1}"
        />
        <text
          class="label"
          x="{d.fatalities > 40
            ? xScale(d.fatalities) - 65
            : xScale(d.fatalities) + 10}"
          y="{d.city == "Dayton" ? yScale(d.total_words) + 15 : yScale(d.total_words) + 5}"
          style="opacity: {(d.location_new === "Restaurant/bar/nightclub" || d.location_new === "Retail") && (d.total_words > 10000 || d.fatalities > 9) ? 0.3 : 0}"
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
        {#each filteredD as d}
        <circle
          cx="{xScale(d.fatalities)}"
          cy="{yScale(d.total_words)}"
          r="3"
          fill="{d.id === selected ? "orange" : "#eeeeee"}"
          style="opacity: {d.id === selected ? 1 : 0.1}"
        />
        <text
          class="label"
          x="{d.fatalities > 40
            ? xScale(d.fatalities) - 65
            : xScale(d.fatalities) + 10}"
          y="{d.city == "Dayton" ? yScale(d.total_words) + 15 : yScale(d.total_words) + 5}"
          style="opacity: {d.id === selected ? 1 : 0}"
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
      Some may think school shootings have been reported widely. In fact, some of the most memorable ones happened in schools, from elementary to college, and they were hugely reported by The Times.
    </p>
  </section>
  <section data-section="1">
    <h4>
      School
    </h4>
    <p>
      As much as notorious school shootings such as Columbine (Littleton), Sandy Hook (Newtown) and Parkland generated a massive amount of coverage, they were also the ones with a lot of victims.
    </p>
    <p>
      However, school shootings are rarely underreported -- one exception may be the one at Oikos University in Oakland, Calif. in 2005, where a former student killed seven, injured three in a classroom. The Times print edition only reported this with 2005 words, in two articles.
    </p>
  </section>
  <section data-section="2">
    <h4>
      Workplace
    </h4>
    <p>
      There have been at least 45 shootings that have happened in a workplace according to Mother Jones’ database and The Violence Project. Most workplace shootings were not reported widely, even with a lot of victims.
    </p>
    <p>
      One outlier is the San Bernardino mass shooting in 2015, where a married couple opened fire at a Christmas party at the husband’s workplace. 14 people were killed and 22 others were wounded. This attack was labeled as terrorism and generated a massive amount of coverage (76,891 words).
    </p>
  </section>
  <section data-section="3">
    <h4>
      Other locations
    </h4>
    <p>
      The location of the shooting partly explains the difference in coverage, but not completely. For example, there is still a huge gap for shootings in retails or restaurants/bars/nightclubs.
    </p>
  </section>
  <section data-section="4">
    <p>
      The shooting you chose, <span>{selectedD.case}</span>, happened in {selectedD.location_new}.
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
    background: rgba(255, 165, 0, 0.6);
    padding: 0 0.3em;
  }
</style>