<script>
  import * as d3 from 'd3';
  import Scroller from "@sveltejs/svelte-scroller";

  export let data;
  export let selected;

  let index, offset, progress, count, selectedD;
  let filteredD = data.filter(d => d.total_front_page !== "NA")
  console.log(filteredD)

  $: selectedD = data.filter(d => d.id === selected)[0]

  const margin = { t: 15, r: 0, b: 50, l: 0 }
  const width = 550;
  const height = 550;

  let xScale = d3.scaleLinear()
		.domain([0, d3.max(filteredD, (d) => d.fatalities) + 1])
		.range([margin.l, width - margin.r]);

  let yScale = d3.scaleLinear()
		.domain(d3.extent(filteredD, (d) => d.total_words))
		.range([height - margin.b, margin.t]);

  $: if (index < 5) {
    xScale = d3.scaleLinear()
      .domain([0, d3.max(filteredD, (d) => d.fatalities) + 1])
      .range([margin.l, width - margin.r]);

    yScale = d3.scaleLinear()
      .domain(d3.extent(filteredD, (d) => d.total_words))
      .range([height - margin.b, margin.t]);
  } 
  else if (index >= 5) {
  }

</script>

<Scroller top="{0.3}" bottom="{0.8}" bind:index bind:offset bind:progress bind:count>
<div slot="background" class="background">
  <svg {width} {height}>
    {#if index == 0 || index == 5}
      <g>
        <text class="axis-label"
              transform={`translate(10, ${height / 2 + 50}) rotate(-90)`}
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
        x={width / 2 - 50} y={height - margin.b + 30}>Total fatal victims</text>
      </g>
    {:else if index == 1}
      <g>
        <text class="axis-label"
              transform={`translate(10, ${height / 2 + 50}) rotate(-90)`}
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
        x={width / 2 - 50} y={height - margin.b + 30}>Total fatal victims</text>
      </g>
    {:else if index == 2}
      <g>
        <text class="axis-label"
              transform={`translate(10, ${height / 2 + 50}) rotate(-90)`}
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
        x={width / 2 - 50} y={height - margin.b + 30}>Total fatal victims</text>
      </g>
    {:else if index == 3}
      <g>
        <text class="axis-label"
              transform={`translate(10, ${height / 2 + 50}) rotate(-90)`}
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
        x={width / 2 - 50} y={height - margin.b + 30}>Total fatal victims</text>
      </g>
    {:else if index == 4}
      <g>
        <text class="axis-label"
              transform={`translate(10, ${height / 2 + 50}) rotate(-90)`}
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
        x={width / 2 - 50} y={height - margin.b + 30}>Total fatal victims</text>
      </g>
    <!-- SCHOOL -->
    {:else if index == 6}
      <g>
        <text class="axis-label"
              transform={`translate(10, ${height / 2 + 50}) rotate(-90)`}
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
        x={width / 2 - 50} y={height - margin.b + 30}>Total fatal victims</text>
      </g>
    <!-- WORKPLACE -->
    {:else if index == 7}
      <g>
        <text class="axis-label"
              transform={`translate(10, ${height / 2 + 50}) rotate(-90)`}
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
        x={width / 2 - 50} y={height - margin.b + 30}>Total fatal victims</text>
      </g>
    <!-- RETAIL/RESTAURANT/BAR/NIGHTCLUB -->
    {:else if index == 8}
      <g>
        <text class="axis-label"
              transform={`translate(10, ${height / 2 + 50}) rotate(-90)`}
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
        x={width / 2 - 50} y={height - margin.b + 30}>Total fatal victims</text>
      </g>
    {:else if index == 9}
      <g>
        <text class="axis-label"
              transform={`translate(10, ${height / 2 + 50}) rotate(-90)`}
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
        x={width / 2 - 50} y={height - margin.b + 30}>Total fatal victims</text>
      </g>
    {/if}
  </svg>
</div>

<div slot="foreground" class="foreground">
  <section data-section="0">
    <h3>Is it the number of victims?</h3>
    <p>
      Generally, when there are more victims, the amount of coverage increases.
    </p>
  </section>
  <section data-section="1">
    <p>
      The one in Las Vegas (58 fatalities, 74,555 words) had by far the most people killed and injured.
    </p>
  </section>
  <section data-section="2">
    <p>
      Compared to other shootings, Las Vegas had less coverage. Orlando nightclub massacre had nine fewer people killed (49 fatalities), and yet generated about 50,000 more words (124,798 words).
    </p>
    <p>
      Same with Virginia Tech massacre in Blacksburg (32 fatalities, about 60,000 words). These seem underreported for the number of people killed.
    </p>
  </section>
  <section data-section="3">
    <p>
      On the other hand, these shootings generated more coverage, considering the number of victims, even more than Orlando.
    </p>
    <p>
      They include Sandy Hook Elementary School massacre in Newtown (27 fatalities, 106,800 words), Columbine High School shooting (13 fatalities, 94,400 words) in Littleton, and those in El Paso, Parkland, Tucson.
    </p>
  </section>
  <section data-section="4">
    <p>
      Given the number of victims, those above the line were reported more, while those below were reported less, compared to other shootings.
    </p>
    <p>
      The shooting of your choice, <span>{selectedD.case}</span>, had a total of {selectedD.fatalities} fatalities and generated {selectedD.total_words} words. It was {selectedD.total_words / selectedD.fatalities > 130000 / 58 ? "above" : "below"} the line.
    </p>
  </section>
  <section data-section="5">
    <h3>
      Is it where the shooting happened?
    </h3>
    <p>
      Some may think school shootings have been reported widely. In fact, some of the most memorable ones happened in schools, from elementary to college, and they were hugely reported by The Times.
    </p>
  </section>
  <section data-section="6">
    <h3>
      School
    </h3>
    <p>
      As much as notorious school shootings such as Columbine (Littleton), Sandy Hook (Newtown) and Parkland generated a massive amount of coverage, they were also the ones with a lot of victims.
    </p>
    <p>
      However, school shootings are rarely underreported -- one exception may be the one at Oikos University in Oakland, Calif. in 2005, where a former student killed seven, injured three in a classroom. The Times print edition only reported this with 2005 words, in two articles.
    </p>
  </section>
  <section data-section="7">
    <h3>
      Workplace
    </h3>
    <p>
      There have been at least 45 shootings that have happened in a workplace according to Mother Jones’ database and The Violence Project. Most workplace shootings were not reported widely, even with a lot of victims.
    </p>
    <p>
      One outlier is the San Bernardino mass shooting in 2015, where a married couple opened fire at a Christmas party at the husband’s workplace. 14 people were killed and 22 others were wounded. This attack was labeled as terrorism and generated a massive amount of coverage (76,891 words).
    </p>
  </section>
  <section data-section="8">
    <h3>
      Retail or Restaurant, Bar, Nightclub
    </h3>
    <p>
      The location of the shooting partly explains the difference in coverage, but not completely. For example, there is still a huge gap for shootings in retails or restaurants/bars/nightclubs.
    </p>
  </section>
  <section data-section="9">
    <p>
      The shooting of your choice, <span>{selectedD.case}</span>, happened in {selectedD.location_new}.
    </p>
    <p>
      Choose other shooting locations to see which ones attracted more coverage by The Times. (In production)
    </p>
    <p style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 0.8em">
      School | Workplace | Retail | Restaurant/bars/nightclubs | Office building | Religious | Outdoors | Other
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
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serifl
  }

  .axis-label {
    opacity: 0.5;
    font-style: italic
  }

  span {
    color: white;
    background: rgba(255, 165, 0, 0.8);
    padding: 0 0.3em;
  }
</style>