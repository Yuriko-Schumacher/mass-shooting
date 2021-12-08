<script>
  import * as d3 from 'd3';
  import Scroller from "@sveltejs/svelte-scroller";

  export let data;
  export let selected;

  let index, offset, progress, count, selectedD;

  data = data.filter(d => d.rank !== "NA")

  $: selectedD = data.filter(d => d.id === selected)[0]

  const margin = { t: 25, r: 50, b: 50, l: 50 }
  const width = window.innerWidth * 0.9 * 0.6;
  const maxHeight = window.innerHeight - 100;
  let height = width / 2.5 > maxHeight ? maxHeight : width / 2.5;

  let innerHeight = height - margin.t - margin.b;
  const innerWidth = width - margin.l - margin.r;

  const parseTime = d3.timeParse("%m/%d/%y")
  const xScale = d3.scaleTime()
      .domain([parseTime("01/01/81"), parseTime("12/31/21")])
      .range([margin.l, width - margin.r]);
  const yScale = d3.scaleLinear()
      .domain([118, 0])
      .range([height - margin.b, margin.t])

</script>


<article>
  <h3>
    Is it because it was linked to an act of hate or terrorism?
  </h3>
  <p>
    By contrast, mass shootings that are linked to hate crimes or terrorism are heavily reported.
  </p>
  <h4>
    Hate crimes
  </h4>
  <p>
    There have been 15 shootings that were linked to possible hate crimes. These include nine that were listed in <a href="https://www.fbi.gov/services/cjis/ucr/data-documentation#Hate-Crime" target="_blank">FBI’s Hate Crime Statistics</a> between 1991 and 2020, as well as six others that were not necessarily declared as a hate crime by FBI, but reported as a possible hate crime -- the Stockton elementary school shooting in 1989, the Wedgwood Baptist Church shooting in 1993, the Isla Vista mass murder in 2014, the Colorado Springs Planned Parenthood shooting in 2015, the Orlando nightclub massacre in 2016, and the Atlanta spa shootings this year.
  </p>
  <p>
    In the shooting in Atlanta this year, eight people were killed, six of whom were Asian women. First portrayed as a possible hate crime against Asians, the shooting generated more coverage, often tied to racial animosity fueled by concerns about the coronavirus, which was first found in China. 
  </p>
</article>
<div class="chart">
  <svg width={width} height={height}>
    <g class="circles">
      {#each data as d} 
          <circle
            cx = "{xScale(d.shooting_date)}"
            cy = "{yScale(d.rank)}"
            r="3"
            fill="{d.hate == "TRUE" ? "orange" : "#cccccc"}"
            fill-opacity="{d.hate == "TRUE" ? 1 : 0.2}"
            rank="{d.rank}"
            id="{d.id}"
          />
      {/each}
    </g>
  </svg>
</div>
<article>
  <p>
    The top two most-reported incidents, ones in El Paso and Orlando, were reported as hate crimes, the former against Latino immigrants, the latter against gay people. All other hate-related shootings generated more coverage than the others, 11 of them were within the top 30 most-reported mass shootings by The Times.
  </p>
  <h4>
    Terrorism
  </h4>
  <p>
    According to a database on global terrorism maintained by the University of Maryland, <a href="https://www.start.umd.edu/gtd/" target="_blank">Global Terrorism Database</a>, which covers all terrorist attacks from 1970 to 2019, there have been 22 terror attacks that were also defined as mass shootings by Mother Jones. In 2020 and 2021, this project found links to terrorism in the Atlanta massage parlor shootings, where the suspect was later indicted on charges including domestic terrorism.
  </p>
</article>
<div class="chart">
  <svg width={width} height={height}>
    <g class="circles">
      {#each data as d} 
          <circle
            cx = "{xScale(d.shooting_date)}"
            cy = "{yScale(d.rank)}"
            r="3"
            fill="{d.terrorism == "TRUE" ? "orange" : "#cccccc"}"
            fill-opacity="{d.terrorism == "TRUE" ? 1 : 0.2}"
            rank="{d.rank}"
            id="{d.id}"
          />
      {/each}
    </g>
  </svg>
</div>
<article>
  <p>
    Out of these 23 terrorism-related incidents, 22 happened after the 9/11 attacks in 2001 -- Columbine High School massacre in 1999 was the only exception. Most of these are among the most high-profile mass shootings in the U.S. and generated with a massive amount of coverage. 
  </p>
  <p>
    These include the 2009 shooting at the Fort Hood Army post in Texas, where an army major fatally shot 13 people, possibly motivated by Islamic extremism, and San Bernardino mass shooting in 2015, where 14 people were killed by a married couple who the FBI described as "homegrown violent extremists" inspired by foreign terrorist groups. The San Bernardino attack was the distinctive outlier of workplace shootings, most of which were conducted by former or current employees and weren’t covered as much.
  </p>
  <p>
    Similar to hate-related ones, most shootings that were considered as an act of terror were reported relatively widely, 18 out of 23 ranked within top 25%.
  </p>
</article>

<style>
  .chart {
    width: 54vw;
    margin: 5rem auto;
  }
</style>