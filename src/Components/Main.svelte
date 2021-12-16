<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  
  import PaperImage from './PaperImage.svelte'
  import viewport from './useViewportAction';
  import NumberOfArticles from './NumberOfArticles.svelte'
  import VictimNumbers from './VictimNumbers.svelte'
  import Locations from './Locations.svelte'
  import Ages from './Ages.svelte'
  import HateTerror from './HateTerror.svelte'
  import Conclusion from './Conclusion.svelte'

  export let dataset;
  export let data;
  export let victimsD;

  data = dataset[0]
  victimsD = dataset[1]

  console.log(dataset)

  let enterViewport, exitViewport;
  let y;
  
  const parseTime = d3.timeParse("%m/%d/%y")
  const getYear = d3.timeFormat("%Y")

  data.map(d => {
    d.id = +d.id;
    d.rank = d.rank == "NA" ? "NA" : +d.rank;
    d.shooting_date = parseTime(d.shooting_date);
    d.year = getYear(d.shooting_date);
    d.fatalities = +d.fatalities;
    d.injured = +d.injured;
    d.total_victims = +d.total_victims;
    d.suspect_1_age = +d.suspect_1_age;
    d.suspect_2_age = +d.suspect_2_age;
    d.count_by_year = +d.count_by_year;
    d.latitude = +d.latitude;
    d.longitude = +d.longitude;
    d.dist_from_ny_miles = +d.dist_from_ny_miles;
    d.total_words = +d.total_words;
    d.total_articles = +d.total_articles;
    d.mentioned_articles = +d.mentioned_articles;
    d.total_front_page = d.total_front_page == "NA" ? "NA" : +d.total_front_page;
    d.made_front_count = d.made_front_count == "NA" ? "NA" : +d.made_front_count;
  })
  
  data.sort((a, b) => {
    return b.total_words - a.total_words;
  });

  victimsD.map(d => {
    d.id = +d.id;
    d.victim_count = +d.victim_count;
    d.victim_age = d.victim_age === "14-20" ? "NA" : +d.victim_age;
    d.total_victims = +d.total_victims;
    d.total_words = +d.total_words;
    d.suspect_1_age = +d.suspect_1_age;
    d.suspect_2_age = d.suspect_2_age === "NA" ? "NA" : +d.suspect_2_age;
  })

  console.log(victimsD)

  let filteredD = data.filter(d => d.total_front_page !== "NA")
  let dropdownD = filteredD.filter(d => d.id != "113" && d.id != "27" && d.id != "91");
  let selectedId = 91;
  let selectedD = data.filter(d => d.id == selectedId)[0];
  let selectedValue = selectedD;
  const selectShootingDropdown = () => {
    d3.selectAll('.selection').classed('active', false);
    selectedD = selectedValue;
  }
  const selectShootingButton = (e) => {
    d3.selectAll('.selection').classed('active', false);
    selectedId = e.target.getAttribute('data-id');
    e.target.classList.add('active');
    selectedD = data.filter(d => d.id == selectedId)[0];
    selectedValue = selectedD;
  }

  let sectionIds = ["overview", "fatalities", "locations", "profiles", "hate-terror"];

  onMount(() => {
    enterViewport = () => {
      function isVisibleFn (ele) {
        const { top, bottom } = ele.getBoundingClientRect();
        const vHeight = window.innerHeight;

        return (
          (top > 0 || bottom > 0)
        );
      }
      let sections = sectionIds.map(id => {
        return document.querySelector(`#${id}`)
      })
      let isVisible = sections.map(sec => {
        return isVisibleFn(sec)
      })
      let visibleSecId = sectionIds[isVisible.findIndex(el => el === true)]
      d3.select(`.${visibleSecId}`).style("border-bottom", "2px solid orange")
    }
    exitViewport = () => {
      function isVisibleFn (ele) {
        const { top, bottom } = ele.getBoundingClientRect();
        const vHeight = (window.innerHeight);

        return (
          (top > 0 || bottom > 0)
        );
      }
      let sections = sectionIds.map(id => {
        return document.querySelector(`#${id}`)
      })
      let isVisible = sections.map(sec => {
        return isVisibleFn(sec)
      })
      let visibleSecId = sectionIds[isVisible.findIndex(el => el === true) - 1]
      d3.selectAll(".nav-item").style("border-bottom", "0px")
    }
  })
</script>

<article>
  <p>
    When you hear the words “mass shooting,” which one comes to your mind first? America’s deadliest shooting in Las Vegas in 2017? The recent one in Atlanta, or one of the school shootings? Or one that happened where you live or one that affected you or your family, friends?
  </p>
</article>

  <div class="selection-section">
    <PaperImage bind:data={selectedD}/>
    <div class="selection-container">
      <p>
        Tell me one tragedy you remember the most. I picked Las Vegas Strip massacre. You can keep it as Las Vegas too.
      </p>
      <p>
        The image on the left shows the copy of the NYT page with first major reports of your selected incident.
      </p>
      <div class="selections">
        <button type="button" class="selection active" data-id="91" on:click={selectShootingButton}>
          Las Vegas Strip massacre
        </button>
        <button type="button" class="selection" data-id="113" on:click={selectShootingButton}>
          El Paso Walmart shooting
        </button>
        <button type="button" class="selection" data-id="27" on:click={selectShootingButton}>
          Columbine High School massacre
        </button>
      </div>
      <div class="selection-dropdown">
        Another one:
        <select bind:value={selectedValue} on:change={selectShootingDropdown}>
          {#each dropdownD as d}
            <option value={d}>{d.case} ({d.year})</option>
          {/each}
        </select>
      </div>
      <p>
        {selectedD.case} happened in {selectedD.year} in {selectedD.city}, {selectedD.state}. {selectedD.fatalities} people were killed{selectedD.injured === 0 ? "." : ""}
        {#if selectedD.injured === 0}
        <span></span>
        {:else}
        and {selectedD.injured === 1 ? "another person was" : ""}{selectedD.injured === 1 ? "" : selectedD.injured}{selectedD.injured === 1 ? "" : " others were"} wounded.
        {/if}
      </p>
    </div>
  </div>
  
<article>
  <h1>
    How much was the <span class="selected-shooting">{selectedD.case}</span> reported, compared to other shootings?
  </h1>
  <p>
    Some of these may be more memorable because they were reported more widely than others. In fact, there are big differences in the coverage of mass shootings. While all these incidents are horrific, some attracted significantly more media attention.
  </p>
  <p>
    A close look at which shootings got the most attention raises questions about what journalists consider newsworthy and how attitudes about victims and perpetrators shape coverage.
  </p>
  <p>
    Not surprisingly, shootings with more victims have been reported more widely than those with fewer. But even with the same number of victims, there has been a difference in coverage in incidents that involve deep social issues such as hate crimes and terrorism.
  </p>
  <p>
    In order to measure media attention and compare shootings, I tracked coverage about each incident in the print edition of The New York Times since 1982. I counted the coverage for a two-week period for each shooting, beginning on the day the incident happened and for the subsequent two weeks. I tallied the number of articles about the shooting and the ones in which that shooting was mentioned, as well as the number of words of articles about the shooting and where they appeared in the paper. 
  </p>
  <p>
    These metrics were effective in comparing the coverage of shootings, since the length and placement of stories reflect editors’ judgment of newsworthiness. Newspapers have a limited amount of space every day, so the editors have to carefully decide on how much they cover each news event, as well as the location of the story in the paper.
  </p>
  <h3>
    What is a mass shooting?
  </h3>
  <p>
    In the U.S., there have been at least 124 mass shootings since 1982, according to the <a href="https://www.motherjones.com/politics/2012/12/mass-shootings-mother-jones-full-data/" target="_blank">Mother Jones’ mass shooting database</a>. It defines a mass shooting as “indiscriminate rampages in public places resulting in four or more victims killed” and excludes “shootings stemming from more conventionally motivated crimes such as armed robbery or gang violence.”
  </p>
  <p>
    The definition of a mass shooting varies between research institutions and media outlets. I’m using Mother Jones’ database because their definition allows more in-depth investigation about a distinct incident.
  </p>
</article>

<div class="scroller-container">
  {#if y > 3500 && y < 30000}
    <div class="sticky-nav">
      <div class="nav-items">
        <div class="nav-item overview" style="border-bottom: 2px solid orange">Overview</div>
        <div class="nav-item fatalities">Fatalities</div>
        <div class="nav-item locations">Locations</div>
        <div class="nav-item profiles">Profiles</div>
        <div class="nav-item hate-terror">Hate/terror</div>
      </div>
      <div class="nav-dropdown">
        You chose: 
        <select bind:value={selectedValue} on:change={selectShootingDropdown}>
          {#each filteredD as d}
            <option value={d}>{d.case} ({d.year})</option>
          {/each}
        </select>
      </div>
    </div>
  {/if}
  <div id="overview" use:viewport on:enterViewport={enterViewport()} on:exitViewport={exitViewport()}>
    <NumberOfArticles data={data} selected={selectedD.id} />
  </div>
  <div id="fatalities" use:viewport on:enterViewport={enterViewport()} on:exitViewport={exitViewport()}>
    <article>
      <h2>Why is there a difference in the amount of coverage?</h2>
      <p>
        Why are some shootings covered more widely than the others? Is it because more people were victimized, or because it happened in a school and killed students? Or, is it because the incident was linked to deep social issues such as terrorism and hate crimes?
      </p>
      <h3>Is it the number of victims?</h3>
    </article>
    <VictimNumbers data={data} selected={selectedD.id}/>
  </div>
  <div id="locations" use:viewport on:enterViewport={enterViewport()} on:exitViewport={exitViewport()}>
    <article>
      <h3>
        Is it where the shooting happened?
      </h3>
      <p>
        Some may think school shootings have been reported widely. In fact, some of the most memorable ones happened in schools, from elementary to college, and they were hugely reported by The Times.
      </p>
    </article>
    <Locations data={data} selected={selectedD.id}/>
  </div>
  <div id="profiles" use:viewport on:enterViewport={enterViewport()} on:exitViewport={exitViewport()}>
    <article>
      <h3>
        Is it who were the shooters? Or who were the victims?
      </h3>
      <p>
        In the late 1990s, a large number of school shootings happened in a row. School shootings tended to be reported widely, and in most of those cases perpetrators or victims were minors. This led to more coverage, as The Times ran articles with headlines such as “<a href="https://www.nytimes.com/2012/12/15/nyregion/witnesses-recall-deadly-shooting-sandy-hook-newtown-connecticut.html" target="_blank">'Who Would Do This to Our Poor Little Babies'</a>” -- one of the first major reports on the Sandy Hook Elementary School massacre. 
      </p>
    </article>
    <Ages data1={data} data2={victimsD} selected={selectedD.id}/>
    <article>
      <h4>
        Profile of shooters/victims
      </h4>
      <p>
        The profile of the shooters/victims, as well as the relationship between the shooters and victims seem to be a substantial factor in the coverage of mass shootings. Shootings that targeted particular groups of people, often with the shooter’s clear motives, have been hugely reported. They weren’t one-time tragedies because of the shooter’s personal grudges or impulsive anger, but were related to serious social issues that were deeply rooted in American society.
      </p>
      <p>
        This becomes more noticeable when looking at shootings with the least amount of coverage -- seven with no print coverage and 20 others with only one article, frequently in the “National Brief” column more than ten pages in.
      </p>
      <p>
        Of these 27 least-reported incidents, many involved either domestic violence or workplace issues. 18 were committed by a former or current boyfriend or husband killing their girlfriend or wife, or a former or current employee opening fire at their workplace.
      </p>
    </article>
  </div>
  <div id="hate-terror" use:viewport on:enterViewport={enterViewport()} on:exitViewport={exitViewport()}>
    <HateTerror data={data} selected={selectedD.id}/>
  </div>
</div>

<Conclusion />
<svelte:window bind:scrollY={y} />

<style>
  article {
    margin: 10em auto;
  }

  .selection-section {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3em;
  }
  
  .selection-container {
    line-height: 1.2;
    text-align: center;
    max-width: 500px;
  }

  .selection-container * {
    font-family: 'Fira Sans Condensed', sans-serif;
    font-size: 18px;
    background: #222222;
    color: #eeeeee;
  }

  .selections {
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
  }

  .selection {
    width: 150px;
    height: 50px;
    font-size: 0.8em;
    padding: 0.3em 0.4em;
    display: flex;
    align-items: center;
    cursor: pointer;
    border: 1px solid #eeeeee;
  }

  .selection:hover {
    color: white;
    border: 1px solid rgba(255, 165, 0, 0.6);
    background: rgba(255, 165, 0, 0.6);
    transition: all 0.2s ease;
  }

  .active {
    color: white;
    border: 1px solid rgba(255, 165, 0, 0.6);
    background: rgba(255, 165, 0, 0.6);
    cursor: default;
  }

  .selection-dropdown {
    margin: 1em auto;
    position: relative;
  }

  span {
    color: white;
    background: rgba(255, 165, 0, 0.6);
    padding: 0 0.3em;
  }

  select {
    height: 30px;
    cursor: pointer;
    background: #222222;
    color: #eeeeee;
    font-family: 'Fira Sans Condensed', sans-serif;
    font-size: 18px;
    outline: 1px solid #eeeeee;
  }

  select:focus {
    color: white;
    outline: 1px solid #eeeeee;
  }

  option {
    background: #222222;
  }

  .scroller-container {
    position: relative;
  }

  .sticky-nav {
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Fira Sans Condensed', sans-serif;
    border-bottom: 10px solid #222222;
    background: #373737;
    background: radial-gradient(circle, rgba(55,55,55,1) 50%, rgba(34,34,34,0) 100%);
    position: sticky;
    padding: 0;
    top: 0;
    left: 0;
    z-index: 999;
  }

  .sticky-nav * {
    font-size: 0.8rem;
  }

  .sticky-nav select {
    background: #373737;
    margin-left: 0.2rem;
    border-width: 0;
  }

  .nav-items {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 50px;
  }

  .nav-item {
    width: fit-content;
    margin: 0 1rem;
    padding: 0.3rem 1rem;
  }
</style>