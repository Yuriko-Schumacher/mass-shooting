<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';

  export let data;
  export let selected;

  let selectedD;

  data = data.filter(d => d.rank !== "NA")

  $: selectedD = data.filter(d => d.id === selected)[0]

  const margin = { t: 100, r: 50, b: 50, l: 75 }
  const width = window.innerWidth * 0.9 * 0.6;
  const height = 500;

  let innerHeight = height - margin.t - margin.b;
  const innerWidth = width - margin.l - margin.r;

  const parseTime = d3.timeParse("%m/%d/%y")
  const getYear = d3.timeFormat("%Y");

  const xScale = d3.scaleTime()
      .domain([parseTime("01/01/81"), parseTime("12/31/21")])
      .range([margin.l, width - margin.r]);
  const yScale = d3.scaleLinear()
      .domain([118, 0])
      .range([height - margin.b, margin.t])

  let years = [...Array(40).keys()].map(d => d + 1982).map(d => d.toString()).map(d => d.slice(-2)).filter(d => d % 5 === 0)
  years = years.map(d => "01/01/".concat("", d))

  const ranks = [1, 30, 60, 90, 120]
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
<div class="chart chart__hate">
  <div class="tooltip"></div>
  <svg width={width} height={height}>
    <g class="chart-title">
      <text transform="translate(0, 30)">
        Coverage of shootings that involved Hate crimes
      </text>
    </g>
    <g class="axis-titles">
      <text class="axis-label small"
            transform={`translate(35, 450) rotate(-90)`}>
            ← Less coverage
      </text>
      <text class="axis-label small"
            transform={`translate(35, 200) rotate(-90)`}>
            More coverage →
      </text>
      <text class="axis-label"
            transform={`translate(15, ${height / 2}) rotate(-90)`}
            text-anchor="end">
            Rank
      </text>
      <text class="axis-label"
            x={innerWidth / 2 + 40}
            y={innerHeight + 145}
            text-anchor="middle">
            Date of the shooting
      </text>
    </g>
    <g class="axis-ticks">
      {#each years as year}
        <text
          x="{xScale(parseTime(year))}"
          y="{innerHeight + 120}"
          fill="white"
          text-anchor="middle"
        >{getYear(parseTime(year))}</text>
        <line
          x1="{xScale(parseTime(year))}"
          y1="{margin.t}"
          x2="{xScale(parseTime(year))}"
          y2="{innerHeight + 120}"
          stroke-width="0.5"
          stroke="white"
          stroke-opacity="0.2"
        ></line>
      {/each}
      {#each ranks as rank}
        <text
          x="{margin.l - 5}"
          y="{yScale(rank) + 5}"
          fill="white"
          text-anchor="end"
        >{rank}</text>
        <line
          x1="{margin.l}"
          y1="{yScale(rank)}"
          x2="{width - margin.r}"
          y2="{yScale(rank)}"
          stroke-width="1.5"
          stroke="white"
          stroke-opacity="0.2"
        ></line>
      {/each}
    </g>
    <g class="circles">
      {#each data as d} 
        <circle
          cx = "{xScale(d.shooting_date)}"
          cy = "{yScale(d.rank)}"
          r="5"
          stroke="{d.id === selected ? "orange" : "#cccccc"}"
          stroke-width="0.4"
          fill="{d.id === selected ? "orange" : "#cccccc"}"
          fill-opacity="{d.hate == "TRUE" ? 0.8 : 0.1}"
          stroke-opacity="{d.hate == "TRUE" ? 1 : 0.4}"
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
  <p>
    The shooting you selected, the <span>{selectedD.case}</span>,
      {#if selectedD.hate == "TRUE"}
        was
      {:else}
        was not
      {/if}
    reported as a hate crime.
  </p>
</article>
<br><br><br>
<article>
  <h4>
    Terrorism
  </h4>
  <p>
    According to a database on global terrorism maintained by the University of Maryland, <a href="https://www.start.umd.edu/gtd/" target="_blank">Global Terrorism Database</a>, which covers all terrorist attacks from 1970 to 2019, there have been 22 terror attacks that were also defined as mass shootings by Mother Jones. In 2020 and 2021, this project found links to terrorism in the Atlanta massage parlor shootings, where the suspect was later indicted on charges including domestic terrorism.
  </p>
</article>
<div class="chart chart__hate">
  <div class="tooltip"></div>
  <svg width={width} height={height}>
    <g class="chart-title">
      <text transform="translate(0, 30)">
        Coverage of shootings that involved Terrorism
      </text>
    </g>
    <g class="axis-titles">
      <text class="axis-label small"
            transform={`translate(35, 450) rotate(-90)`}>
            ← Less coverage
      </text>
      <text class="axis-label small"
            transform={`translate(35, 200) rotate(-90)`}>
            More coverage →
      </text>
      <text class="axis-label"
            transform={`translate(15, ${height / 2}) rotate(-90)`}
            text-anchor="end">
            Rank
      </text>
      <text class="axis-label"
            x={innerWidth / 2 + 40}
            y={innerHeight + 145}
            text-anchor="middle">
            Date of the shooting
      </text>
    </g>
    <g class="axis-ticks">
      {#each years as year}
        <text
          x="{xScale(parseTime(year))}"
          y="{innerHeight + 120}"
          fill="white"
          text-anchor="middle"
        >{getYear(parseTime(year))}</text>
        <line
          x1="{xScale(parseTime(year))}"
          y1="{margin.t}"
          x2="{xScale(parseTime(year))}"
          y2="{innerHeight + 120}"
          stroke-width="0.5"
          stroke="white"
          stroke-opacity="0.2"
        ></line>
      {/each}
      {#each ranks as rank}
        <text
          x="{margin.l - 5}"
          y="{yScale(rank) + 5}"
          fill="white"
          text-anchor="end"
        >{rank}</text>
        <line
          x1="{margin.l}"
          y1="{yScale(rank)}"
          x2="{width - margin.r}"
          y2="{yScale(rank)}"
          stroke-width="1.5"
          stroke="white"
          stroke-opacity="0.2"
        ></line>
      {/each}
    </g>
    <g class="circles">
      {#each data as d} 
        <circle
          cx = "{xScale(d.shooting_date)}"
          cy = "{yScale(d.rank)}"
          r="5"
          stroke="{d.id === selected ? "orange" : "#cccccc"}"
          stroke-width="0.4"
          fill="{d.id === selected ? "orange" : "#cccccc"}"
          fill-opacity="{d.terrorism == "TRUE" ? 0.8 : 0.1}"
          stroke-opacity="{d.terrorism == "TRUE" ? 1 : 0.4}"
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
  <p>
    The shooting you selected, the <span>{selectedD.case}</span>,
      {#if selectedD.terrorism == "TRUE"}
        was
      {:else}
        was not
      {/if}
    reported as an act of terror.
  </p>
</article>

<style>
  .chart {
    width: 54vw;
    max-width: 600px;
    margin: 5rem auto;
  }

  .axis-ticks {
    fill: #eeeeee;
    font-size: 12px;
    font-family: 'Fira Sans Condensed', sans-serif;
    opacity: 0.8;
  }

  .small {
    font-size: 0.8em;
  }

  span {
    color: white;
    background: rgba(255, 165, 0, 0.6);
    padding: 0 0.3em;
  }

</style>