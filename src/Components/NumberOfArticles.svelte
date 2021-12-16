<script>
  import * as d3 from 'd3';
  import Scroller from "@sveltejs/svelte-scroller";
  import { spring } from 'svelte/motion';
import { lineRadial } from 'd3';

  export let data;
  export let selected;

  let index, offset, progress, count, selectedD, top10D, chartTitle;

  $: {
    selectedD = data.filter(d => d.id === selected)[0]
    top10D = data.filter(d => d.rank <= 10 || d.id === selected)
  } 

  const parseTime = d3.timeParse("%m/%d/%y")
  const format = d3.format(',')
  const getYear = d3.timeFormat("%Y");

  const margin = { t: 75, r: 50, b: 75, l: 75 }
  const width = window.innerWidth * 0.9 * 0.6;
  const maxHeight = window.innerHeight;
  let height = width > maxHeight ? maxHeight : width;

  let innerHeight = height - margin.t - margin.b;
  const innerWidth = width - margin.l - margin.r;

  let years = [...Array(40).keys()].map(d => d + 1982);
  const counts = [...Array(12).keys()].map(d => d + 1);

  let xScale = d3.scaleBand()
          .domain(years)
          .range([margin.l, width - margin.r])
          .paddingInner(0.5);

  let yScale = d3.scaleLinear()
      .domain([0, 13])
      .range([height - margin.b, margin.t]);

  const rScale= d3.scaleSqrt()
      .domain([0, 28])
      .range([3, 10])

  const hlineNumbers = [...Array(13).keys()].map((el) => el * 10000);
  const radiusLegends = [0, 1, 10, 20, 28];
  console.log(radiusLegends)

  let xAxisLabel, yAxisLabel;
  let axisTitles = {
    x: "",
    y: ""
  }

  const move = (cx, cy) => `transform: translate(${cx}px, ${cy}px`;
  const colors = {
    orange : {
      r: 255,
      g: 165,
      b: 0
    },
    white : 238,
    black : 34
  }

  let circles = spring(
    data.map((d) => ({
      cx: 0,
      cy: 0,
      cr: 0,
      strokeWidth: 0,
      opacity: 1,
      r: 0,
      g: 0,
      b: 0,
      id: d.id
    })),
    {
      stiffness: 0.1,
      damping: 0.9
    }
  );
  let newCircles; 

  let rects = spring(
    data.map(d => (
      {
        x: 0,
        y: 0,
        height: 0,
        opacity: 0,
        r: colors.white,
        g: colors.white,
        b: colors.white,
        id: d.id
      }
    )),
    {
      stiffness: 0.1,
      damping: 0.9
    }
  )
  let newRects;

  $: if (index < 3) {
    chartTitle = "Number of mass shootings over the years"
    height = width / 2.5 > maxHeight ? maxHeight : width / 2.5;
    innerHeight = height - margin.t - margin.b;

    years = [...Array(40).keys()].map(d => d + 1982);

    xScale = d3.scaleBand()
          .domain(years)
          .range([margin.l, width - margin.r])
          .paddingInner(0.5);

    yScale = d3.scaleLinear()
        .domain([0, 13])
        .range([height - margin.b, margin.t]);

    axisTitles = {
      x: "Year",
      y: "Total mass shootings"
    }

    const initialCircleSize = xScale.bandwidth() - height / 80

      if (index === 0) {
        newCircles = data.map((d) => ({
          cx: xScale(+d.year),
          cy: yScale(d.count_by_year),
          cr: initialCircleSize,
          strokeWidth: 0,
          opacity: 1,
          r: colors.white,
          g: colors.white,
          b: colors.white,
          id: d.id
        }))
      } else if (index === 1) {
        newCircles = data.map((d) => ({
          cx: xScale(+d.year),
          cy: yScale(d.count_by_year),
          cr: initialCircleSize,
          strokeWidth: 0,
          opacity: d.id === selected ? 1 : 0.1,
          r: d.id === selected ? colors.orange.r : colors.white,
          g: d.id === selected ? colors.orange.g : colors.white,
          b: d.id === selected ? colors.orange.b : colors.white,
          id: d.id
        }))
      } else if (index === 2) {
        newCircles = data.map((d) => ({
          cx: xScale(+d.year),
          cy: yScale(d.count_by_year),
          cr: initialCircleSize,
          strokeWidth: 0,
          opacity: d.rank === "NA" ? 1 : 0.1,
          r: colors.white,
          g: colors.white,
          b: colors.white,
          id: d.id
        }))
      }
      circles.set(newCircles)
  } 
  else if (index >= 3) {
    height = width / 1.5 > maxHeight ? maxHeight : width / 1.5;
    innerHeight = height - margin.t - margin.b;

    years = [...Array(40).keys()].map(d => d + 1982).map(d => d.toString()).map(d => d.slice(-2)).filter(d => d % 5 === 0)
    years = years.map(d => "01/01/".concat("", d))

    xScale = d3.scaleTime()
      .domain([parseTime("01/01/81"), parseTime("12/31/21")])
      .range([margin.l, width - margin.r]);

    yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.total_words)])
      .range([height - margin.b, margin.t]);

    axisTitles = (index == 3) ? {
      x: "",
      y: ""
    }
    : {
      x: "Date",
      y: "Total number of words"
    }
    chartTitle = (index == 3) ? "" : index < 6 ? "Total number of words in NYT print edition" : "Total number of front page articles in NYT print edition"

    if (index === 3) {
      newCircles = data.map((d) => ({
        cx: xScale(d.shooting_date),
        cy: innerHeight / 2,
        cr: 3,
        strokeWidth: 0.4,
        opacity: d.rank === "NA" ? 0 : 0.5,
        r: colors.white,
        g: colors.white,
        b: colors.white,
        id: d.id
      }))
      newRects = data.map(d => (
        {
          x: xScale(d.shooting_date),
          y: yScale(d.total_words),
          height: height - yScale(d.total_words) - margin.b,
          opacity: 0,
          r: colors.white,
          g: colors.white,
          b: colors.white,
          id: d.id
        }
      ))
    } else if (index === 4) {
      newCircles = data.map((d) => ({
        cx: xScale(d.shooting_date),
        cy: yScale(d.total_words),
        cr: 1.5,
        strokeWidth: 0,
        opacity: d.rank === "NA" ? 0 : 1,
        r: colors.white,
        g: colors.white,
        b: colors.white,
        id: d.id
      }))
      newRects = data.map(d => (
        {
          x: xScale(d.shooting_date),
          y: yScale(d.total_words),
          height: height - yScale(d.total_words) - margin.b,
          opacity: 1,
          r: colors.white,
          g: colors.white,
          b: colors.white,
          id: d.id
        }
      ))
    } else if (index === 5) {
      newCircles = data.map((d) => ({
        cx: xScale(d.shooting_date),
        cy: yScale(d.total_words),
        cr: 1.5,
        strokeWidth: 0,
        opacity: d.rank === "NA" ? 0 : d.id === 113 || d.id === selected ? 1 : 0.1,
        r: d.id === selected ? colors.orange.r : colors.white,
        g: d.id === selected ? colors.orange.g : colors.white,
        b: d.id === selected ? colors.orange.b : colors.white,
        id: d.id
      }))
      newRects = data.map(d => (
        {
          x: xScale(d.shooting_date),
          y: yScale(d.total_words),
          height: height - yScale(d.total_words) - margin.b,
          opacity: d.rank === "NA" ? 0 : d.id === 113 || d.id === selected ? 1 : 0.1,
          r: d.id === selected ? colors.orange.r : colors.white,
          g: d.id === selected ? colors.orange.g : colors.white,
          b: d.id === selected ? colors.orange.b : colors.white,
          id: d.id
        }
      ))
    } else if (index === 6) {
      newCircles = data.map((d) => ({
        cx: xScale(d.shooting_date),
        cy: yScale(d.total_words),
        cr: rScale(d.total_front_page),
        strokeWidth: 0.4,
        opacity: d.rank === "NA" ? 0 : 0.8,
        r: d.if_made_on_front == "FALSE" ? colors.black : colors.white,
        g: d.if_made_on_front == "FALSE" ? colors.black : colors.white,
        b: d.if_made_on_front == "FALSE" ? colors.black : colors.white,
        id: d.id
      }))
      newRects = data.map(d => (
        {
          x: xScale(d.shooting_date),
          y: yScale(d.total_words),
          height: height - yScale(d.total_words) - margin.b,
          opacity: 1,
          r: d.if_made_on_front == "FALSE" ? colors.black : colors.white,
          g: d.if_made_on_front == "FALSE" ? colors.black : colors.white,
          b: d.if_made_on_front == "FALSE" ? colors.black : colors.white,
          id: d.id
        }
      ))
    } else if (index === 7) {
      newCircles = data.map((d) => ({
        cx: xScale(d.shooting_date),
        cy: yScale(d.total_words),
        cr: rScale(d.total_front_page),
        strokeWidth: 0.4,
        opacity: d.rank === "NA" ? 0 : d.id === 97 || d.id === selected ? 1 : 0.05,
        r: d.if_made_on_front == "FALSE" ? colors.black : d.id === selected ? colors.orange.r : colors.white,
        g: d.if_made_on_front == "FALSE" ? colors.black : d.id === selected ? colors.orange.g : colors.white,
        b: d.if_made_on_front == "FALSE" ? colors.black : d.id === selected ? colors.orange.b : colors.white,
        id: d.id
      }))
      newRects = data.map(d => (
        {
          x: xScale(d.shooting_date),
          y: yScale(d.total_words),
          height: height - yScale(d.total_words) - margin.b,
          opacity: d.rank === "NA" ? 0 : d.id === 97 || d.id === selected ? 1 : 0.1,
          r: d.if_made_on_front == "FALSE" ? colors.black : d.id === selected ? colors.orange.r : colors.white,
          g: d.if_made_on_front == "FALSE" ? colors.black : d.id === selected ? colors.orange.g : colors.white,
          b: d.if_made_on_front == "FALSE" ? colors.black : d.id === selected ? colors.orange.b : colors.white,
            id: d.id
        }
      ))
    }
    circles.set(newCircles)
    rects.set(newRects)
  }

</script>

<Scroller top="{0.2}" bottom="{0.9}" bind:index bind:offset bind:progress bind:count>
<div slot="background" class="background">
  <svg {width} {height}>
      <g>
        <g class="chart-title">
          <text transform="translate(0, 30)">
            {chartTitle}
          </text>
        </g>
        <g class="axis-titles">
          <text class="axis-label"
                transform={`translate(15, ${innerHeight / 2 + 150}) rotate(-90)`}>
            {axisTitles.y}
          </text>
          <text class="axis-label"
                x={innerWidth / 2 + 40}
                y={innerHeight + 120}>
            {axisTitles.x}
          </text>
        </g>
        <g class="axis-ticks">
          <line
            x1="{margin.l}"
            y1="{height - margin.b}"
            x2="{width - margin.r}"
            y2="{height - margin.b}"
            stroke-width="1.5"
            stroke="white"
            stroke-opacity="{index === 3 ? 0 : 0.2}"
          ></line>
          {#each years as year}
            <text
              x="{index <= 3 ? xScale(year) : xScale(parseTime(year))}"
              y="{innerHeight + 90}"
              fill="white"
              text-anchor="middle"
              fill-opacity="{index <= 3 ? year % 5 === 0 ? 1 : 0 : 1}"
            >{index <= 3 ? year : getYear(parseTime(year))}</text>
            <line
              x1="{index <= 3 ? xScale(year) : xScale(parseTime(year))}"
              y1="{innerHeight + 70}"
              x2="{index <= 3 ? xScale(year) : xScale(parseTime(year))}"
              y2="{innerHeight + 80}"
              stroke-width="{year % 5 === 0 ? 1.5 : 0}"
              stroke="white"
              stroke-opacity="0.2"
            ></line>
          {/each}
        </g>
        {#if index < 3}
          <g class="axis-ticks">
            {#each counts as count}
              <text
                x="{margin.l - 5}"
                y="{yScale(count) + 5}"
                fill="white"
                text-anchor="end"
                fill-opacity="{count % 5 === 0 ? 1 : 0}"
              >{count}</text>
              <line
                x1="{margin.l}"
                y1="{yScale(count)}"
                x2="{width - margin.r}"
                y2="{yScale(count)}"
                stroke-width="{count % 5 === 0 ? 1.5 : 0.5}"
                stroke="white"
                stroke-opacity="0.2"
              ></line>
            {/each}
          </g>
        {:else if index > 3}
          <g class="y-axis-grids">
            {#each hlineNumbers as n}
              <line 
                x1="{margin.l}"
                y1="{yScale(n)}"
                x2="{width - margin.r}"
                y2="{yScale(n)}"
                stroke="gray"
                stroke-opacity=0.5
                stroke-width=0.5
              />
              <text
                class="axis-ticks"
                x="{margin.l - 5}"
                y="{yScale(n) + 5}"
                fill="white"
                text-anchor="end"
              >{format(n)}
              </text>
            {/each}
          </g>
          {#if index >= 6}
            <g class="radius-legend">
              {#each radiusLegends as n, i}
                <circle
                  cx="{i * 50 + 25}"
                  cy="{margin.t - 20}"
                  r={rScale(n)}
                  fill="{n === 0 ? "#222222" : "#eeeeee"}"
                  fill-opacity="0.8"
                  stroke="#eeeeee"
                  stroke-width="0.4"
                ></circle>
                <text
                  class="axis-ticks"
                  x={i * 50 + 25}
                  y={margin.t}
                  fill="white"
                  text-anchor="middle"
                >{n}</text>
              {/each}
            </g>
          {/if}
        {/if}
        <g class="circles">
          {#each $circles as {cx, cy, cr, strokeWidth, opacity, r, g, b, id}} 
              <circle
                style="{move(cx, cy)}"
                r="{cr}"
                stroke="#cccccc"
                stroke-width="{strokeWidth}"
                stroke-opacity="{opacity}"
                fill="rgb({r}, {g}, {b})"
                fill-opacity="{opacity}"
                id="{id}"
              />
          {/each}
        </g>
        <g class="rects">
          {#each $rects as {x, y, height, opacity, r, g, b, id}}
            <rect
              x="{x}"
              y="{y}"
              width="0.5"
              height="{height}"
              strokeWidth="0.5"
              fill="rgb({r}, {g}, {b})"
              style="opacity: {opacity}"
              id="{id}"
            ></rect>
          {/each}
        </g>
      </g>
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
      The shooting you remember the most, <span class="selected">{selectedD.case}</span>, happened in {selectedD.year} in {selectedD.city}, {selectedD.state}.
    </p>
    {#if selectedD.total_by_year > 1}
      <p>
        It was one of the {selectedD.total_by_year} shootings that year.
      </p>
    {:else}
      <p>
        It was the only shooting happened that year.
      </p>
    {/if}
  </section>
  <section data-section="2">
    <p>
      For all 124 shootings, I tracked the coverage by The New York Times’ print edition, from the date the shooting happened and two weeks after that date. This project found no articles about these seven shootings.
    </p>
    <p>
      These include <span class="highlighted">Atlantis Plastics shooting</span> in Henderson, Kentucky in 2008 where six people were killed by an employee at the factory. Another is the <span class="highlighted">Trestle Trail bridge shooting</span> in Menasha, Wisconsin in 2015, and the <span class="highlighted">hotel bar shooting</span> in State College, Pennsylvania in 2019.
    </p>
  </section>
  <section data-section="3">
    <p>For all other 117 incidnets that had at least one article...</p>
  </section>
  <section data-section="4">
    <p>
      This chart shows the number of total words. Increasingly widely-reported shootings have happened in recent years.
    </p>
  </section>
  <section data-section="5">
    <h4>
      Top 10 shootings with the most amount of coverage
    </h4>
    <table>
      <thead>
        <tr>
          <th class="table__rank">Rank</th>
          <th class="table__case">Case</th>
          <th class="table__year">Year</th>
          <th class="table__total-words">Total words</th>
        </tr>
      </thead>
      <tbody>
        {#each top10D as d}
          <tr class="{d.id === selected ? "tr__selected" : "tr__non-selected"}">
            <td class="table__rank">{d.rank}</td>
            <td class="table__case">{d.case}</td>
            <td class="table__year">{d.year}</td>
            <td class="table__total-words">{format(d.total_words)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
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
  <section data-section="6">
    <p>
      Of all 117 shootings that had at least one article, 65 made it to the front page while 52 didn’t. 
    </p>
    <p>
      The sizes of the circles indicate the number of front page articles.
    </p>
  </section>
  <section data-section="7">
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
    font-size: 16px;
    font-family: 'Fira Sans Condensed', sans-serif;
    opacity: 0.5;
    font-style: italic
  }

  table, tr {
    border: 0.2px solid #eeeeee;
    font-family: 'Fira Sans Condensed', sans-serif;
    border-collapse: collapse;
    font-size: 0.9em;
  }

  table {
    margin-bottom: 2em;
  }

  thead {
    background: rgba(238, 238, 238, 0.6);
    color: #222222;
    border-color: #eeeeee;
  }

  .tr__selected {
    background: rgba(255, 165, 0, 0.6);
  }

  td, th {
    text-align: center;
    padding: 0.3em 0.5em;
  }

  .table__case {
    text-align: left;
  }

  .axis-ticks, .text-label {
    fill: #eeeeee;
    font-size: 12px;
    font-family: 'Fira Sans Condensed', sans-serif;
    opacity: 0.8;
    text-shadow: 0px 0px 2px black;
  }

  span {
    padding: 0 0.3em;
  }

  .selected {
    color: white;
    background: rgba(255, 165, 0, 0.6);
  }

  .highlighted {
    color: #222222;
    background: rgb(238, 238, 238);
  }
</style>