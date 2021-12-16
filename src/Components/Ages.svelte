<script>
  import * as d3 from 'd3';
  import Scroller from "@sveltejs/svelte-scroller";
  import { spring } from 'svelte/motion';

  export let data1;
  export let data2;
  export let selected;

  data2 = data2
			.filter((data) => data.victim_age !== "NA");

  let index, offset, progress, count, selectedD;
  let selectedD2, averageAge;
  let simulation, chartTitle;

  $: selectedD = data1.filter(d => d.id === selected)[0]
  $: {
    selectedD2 = data2.filter(d => d.id === selected)
    let ages = selectedD2.map(d => d.victim_age)
    let agesSum = ages.reduce((a, b) => {
      return a + b
    }, 0)
    averageAge = Math.round(agesSum / selectedD2.length * 10) / 10
  }

  const format = d3.format(",");

  const margin = { t: 75, r: 150, b: 100, l: 70 }
  const width = window.innerWidth * 0.9 * 0.6;
  const maxHeight = window.innerHeight - 200;
  let height = width > maxHeight ? maxHeight : width;

  let innerHeight = height - margin.t - margin.b;
  const innerWidth = width - margin.l - margin.r;
  const hlineNumbers = [...Array(13).keys()].map((el) => el * 10000);
  const vlineNumbers = [...Array(101).keys()].filter(d => d % 10 === 0);

  const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([margin.l, innerWidth]);

  const yScale = d3.scaleLinear()
      .domain(d3.extent(data2, (d) => d.total_words))
      .range([innerHeight, margin.t]);

  let axisTitles = {
    x: "Suspect's age",
    y: "Total number of words"
  }

  const move = (cx, cy) => `transform: translate(${cx}px, ${cy}px)`;
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
    data2.map((d) => ({
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

  let lines = spring(
    data1.map(d => ({
      strokeOpacity: 0.1,
      totalWords: d.total_words,
      r: 0,
      g: 0,
      b: 0,
    })),
    {
      stiffness: 0.1,
      damping: 0.9
    }
  )

  let newCircles; 
  let newLines;
  let vicRadius = width / 600;

  $:  {
    simulation = d3
      .forceSimulation(data2.filter(d => d.victims_age !== "NA" && d.victims_age !== "14-20"))
      .force("collide", d3.forceCollide().radius(vicRadius * 1.1))
      .force(
        "x",
        d3.forceX().x((d) => xScale(d.victim_age))
      )
      .force(
        "y",
        d3.forceY().y((d) => yScale(d.total_words))
      )
      .stop()
      .tick(100);

    if (index === 0) {
      chartTitle = "Age of suspects and the total number of words"
      axisTitles = {
        x: "Suspect's age",
        y: "Total number of words"
      }
      newCircles = data2.map(d => ({
        cx: d.suspect_2_age == "NA"
              ? xScale(d.suspect_1_age)
              : xScale((d.suspect_1_age + d.suspect_2_age) / 2),
        cy: yScale(d.total_words),
        cr: 3,
        strokeWidth: 0,
        opacity: d.victim_count === 1 ? 0.8 : 0,
        r: colors.white,
        g: colors.white,
        b: colors.white,
        id: d.id
      }))
      newLines = data1.map(d => ({
        strokeOpacity: 0,
        totalWords: d.total_words,
        r: 0,
        g: 0,
        b: 0,
      }))
    } else if (index === 1) {
      newCircles = data2.map(d => ({
        cx: d.suspect_2_age == "NA"
              ? xScale(d.suspect_1_age)
              : xScale((d.suspect_1_age + d.suspect_2_age) / 2),
        cy: yScale(d.total_words),
        cr: 3,
        strokeWidth: 0,
        opacity: d.victim_count !== 1 ? 0 : d.id === 25 || d.id === 33 ? 0.8 : 0.1,
        r: colors.white,
        g: colors.white,
        b: colors.white,
        id: d.id
      }))
      newLines = data1.map(d => ({
        strokeOpacity: 0,
        totalWords: d.total_words,
        r: 0,
        g: 0,
        b: 0,
      }))
    } else if (index === 2) {
      newCircles = data2.map(d => ({
        cx: d.suspect_2_age == "NA"
              ? xScale(d.suspect_1_age)
              : xScale((d.suspect_1_age + d.suspect_2_age) / 2),
        cy: yScale(d.total_words),
        cr: 3,
        strokeWidth: 0,
        opacity: d.victim_count !== 1 ? 0 : (d.suspect_1_age >= 15 && d.suspect_1_age <= 25) || d.id === selected ? 0.8 : 0.1,
        r: d.id === selected ? colors.orange.r : colors.white,
        g: d.id === selected ? colors.orange.g : colors.white,
        b: d.id === selected ? colors.orange.b : colors.white,
        id: d.id
      }))
      newLines = data1.map(d => ({
        strokeOpacity: 0,
        totalWords: d.total_words,
        r: 0,
        g: 0,
        b: 0,
      }))
    } else if (index === 3) {
      chartTitle = "Ages of victims and the total number of words"
      axisTitles = {
        x: "Victim's age",
        y: "Total number of words"
      }
      newCircles = data2.map(d => ({
        cx: d.x,
        cy: d.y,
        cr: vicRadius,
        strokeWidth: 0,
        opacity: d.x === 0 ? 0 : 1,
        r: colors.white,
        g: colors.white,
        b: colors.white,
        id: d.id
      }))
      newLines = data1.map(d => ({
        strokeOpacity: 0.1,
        totalWords: d.total_words,
        r: colors.white,
        g: colors.white,
        b: colors.white,
      }))
    } else if (index === 4) {
      newCircles = data2.map(d => ({
          cx: d.x,
          cy: d.y,
          cr: vicRadius,
          strokeWidth: 0,
          opacity: d.x === 0 ? 0 : d.id === 62 || d.id === 27 || d.id === 42 ? 1 : 0.1,
          r: colors.white,
          g: colors.white,
          b: colors.white,
          id: d.id
        }))
        newLines = data1.map(d => ({
          strokeOpacity: d.id === 62 || d.id === 27 || d.id === 42 ? 0.8 : 0.1,
          totalWords: d.total_words,
          r: colors.white,
          g: colors.white,
          b: colors.white,
        }))
    } else if (index === 5) {
      newCircles = data2.map(d => ({
          cx: d.x,
          cy: d.y,
          cr: vicRadius,
          strokeWidth: 0,
          opacity: d.x === 0 ? 0 : d.id === 112 || d.id === 40 ? 1 : 0.1,
          r: colors.white,
          g: colors.white,
          b: colors.white,
          id: d.id
        }))
        newLines = data1.map(d => ({
          strokeOpacity: d.id === 112 || d.id === 40 ? 0.8 : 0.1,
          totalWords: d.total_words,
          r: colors.white,
          g: colors.white,
          b: colors.white,
        }))
    } else if (index === 6) {
      newCircles = data2.map(d => ({
          cx: d.x,
          cy: d.y,
          cr: vicRadius,
          strokeWidth: 0,
          opacity: d.x === 0 ? 0 : 1,
          r: d.id === selected ? colors.orange.r : colors.white,
          g: d.id === selected ? colors.orange.g : colors.white,
          b: d.id === selected ? colors.orange.b : colors.white,
          id: d.id
        }))
      newLines = data1.map(d => ({
        strokeOpacity: d.id === selected ? 0.8 : 0.1,
        totalWords: d.total_words,
        r: d.id === selected ? colors.orange.r : colors.white,
        g: d.id === selected ? colors.orange.g : colors.white,
        b: d.id === selected ? colors.orange.b : colors.white,
      }))
    }
    circles.set(newCircles)
    lines.set(newLines)
  }

</script>

<Scroller top="{0.2}" bottom="{1}" bind:index bind:offset bind:progress bind:count>
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
              transform={`translate(15, ${innerHeight / 2 + 70}) rotate(-90)`}>
          {axisTitles.y}
        </text>
        <text class="axis-label"
              x={innerWidth / 2 + 40}
              y={innerHeight + 45}
              text-anchor="middle">
          {axisTitles.x}
        </text>
      </g>
      <g class="x-axis-ticks">
        {#each vlineNumbers as n}
          <line
            x1="{xScale(n)}"
            y1="{yScale(0) + 20}"
            x2="{xScale(n)}"
            y2="{margin.t - 10}"
            stroke="gray"
            stroke-opacity=0.5
            stroke-width=0.5
          ></line>
          <text
            x="{xScale(n)}"
            y="{yScale(0) + 20}"
            fill="white"
            class="axis-ticks"
            text-anchor="middle"
          >{n}</text>
        {/each}
      </g>
      <g class="y-axis-ticks">
        {#each hlineNumbers as n}
          <line 
            x1="{margin.l - 5}"
            y1="{yScale(n)}"
            x2="{n === 0 ? xScale(100) + 5 : margin.l + 5}"
            y2="{yScale(n)}"
            stroke="gray"
            stroke-opacity=1
            stroke-width=0.5
          />
          <text
            class="axis-ticks"
            x="{margin.l - 10}"
            y="{yScale(n) + 5}"
            fill="white"
            text-anchor="end"
          >{format(n)}
          </text>
        {/each}
      </g>
      <g class="lines">
        {#each $lines as {strokeOpacity, totalWords, r, g, b}}
          <line
            x1={margin.l}
            y1={yScale(totalWords)}
            x2="{width - margin.r}"
            y2={yScale(totalWords)}
            stroke="rgb({r}, {g}, {b})"
            stroke-width="0.5"
            stroke-opacity="{strokeOpacity}"
          ></line>
        {/each}
      </g>
      <g class="circles">
        {#each $circles as {cx, cy, cr, strokeWidth, opacity, r, g, b, id}} 
          <circle
            style="{move(cx, cy)}"
            r="{cr}"
            stroke="#cccccc"
            stroke-width="{strokeWidth}"
            stroke-opacity="{cx === 0 ? 0 : opacity}"
            fill="rgb({r}, {g}, {b})"
            fill-opacity="{cx === 0 ? 0 : opacity}"
            id="{id}"
          />
        {/each}
      </g>
    </g>
  </svg>
</div>

<div slot="foreground" class="foreground">
  <section data-section="0">
    <h4>
      Suspects
    </h4>
    <p>
      This chart shows the ages of suspects at the time of the shooting and the number of words for each shooting. If there were two suspects, the points are located on the average age.
    </p>
  </section>
  <section data-section="1">
    <p>
      The youngest suspect ever was an 11-year-old boy who, with another boy, 13, shot their peers and teachers in their middle school in Jonesboro, Ark. in 1998. This was covered relatively widely, with about 25,000 words and a total of 35 articles. 
    </p>
    <p>
      The oldest suspect was a 66-year-old employee who had been terminated who opened fire at his former workplace in Melrose Park, Ill., in 2001. He killed five people and injured four others, which generated 1661 words in The Times print edition.
    </p>
  </section>
  <section data-section="2">
    <p>
      Suspects in shootings with the most amount of coverage tend to be in or around their 20s. Shootings by middle-aged or older perpetrators are rarely reported most widely.
    </p>
    {#if selectedD.suspect_2_age == 0}
      <p>
        The suspect of the shooting you remember the most, the <span>{selectedD.case}</span>, was {selectedD.suspect_1_age} years old at the time of the incident.
      </p>
    {:else}
      <p>
        The suspects of the shooting you remember the most, the <span>{selectedD.case}</span>, were {selectedD.suspect_1_age} and {selectedD.suspect_2_age} years old at the time of the incident.
      </p>
    {/if}
  </section>
  <section data-section="3">
    <h4>
      Victims
    </h4>
    <p>
      This chart shows the ages of the fatal victims at the time of the shooting, in relation to the number of words in coverage by The Times. Each dot represents one victim.
    </p>
  </section>
  <section data-section="4">
    <p>
      The victim’s age somewhat explains the difference in the amount of coverage. 
    </p>
    <p>
      There are clusters of young victims in Newtown (Sandy Hook), Littleton (Columbine), and Blacksburg (Virginia Tech) shootings. All happened in school, and students were victimized.
    </p>
  </section>
  <section data-section="5">
    <p>
      However, there are other shootings that weren’t reported widely with young victims, such as the one in Gilroy, Calif., where a 6-year-old, as well as a 13-year-old and 25-year-old were killed, and 15 others were injured. This shooting was only reported with a little more than 4500 words. Another exception may be the Amish school shooting in Lancaster County, Penn. in 2006, where five young girls were shot dead.
    </p>
  </section>
  <section data-section="6">
    <p>
      From this analysis, it may be premature to conclude the victim's age is the sole factor to determine the amount of coverage.
    </p>
    <p>
      Main exceptions are the shootings in El Paso and Tucson. However, these two had noteworthy victims: mostly Latinos in the former, and a congresswoman in the latter.
    </p>
    <p>
      The shooting you chose, <span>{selectedD.case}</span>, had a total of {selectedD.total_victims} victims, {selectedD2.length} fatal. The average age of the fatal victims was {averageAge}.
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

  .axis-label {
    fill: #eeeeee;
    font-family: 'Fira Sans Condensed', sans-serif;
    opacity: 0.5;
    font-size: 16px;
    font-style: italic
  }

  .axis-ticks {
    fill: #eeeeee;
    font-size: 12px;
    font-family: 'Fira Sans Condensed', sans-serif;
    opacity: 0.8;
  }

  span {
    color: white;
    background: rgba(255, 165, 0, 0.6);
    padding: 0 0.3em;
  }
</style>