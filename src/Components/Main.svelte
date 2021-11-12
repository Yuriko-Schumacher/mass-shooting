<script>
  import * as d3 from 'd3';
  import ScrollerContent1 from './ScrollerContent1.svelte'
  import ScrollerContent2 from './ScrollerContent2.svelte'
  import Content3 from './Content3.svelte'
import { onMount } from 'svelte';

  export let data;
  
  const parseTime = d3.timeParse("%m/%d/%y")
  const getYear = d3.timeFormat("%Y")

  const parseData = (data) => {
    data.map(d => {
      d.id = +d.id;
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
  }
  
  data.sort((a, b) => {
    return b.total_words - a.total_words;
  });
  parseData(data);

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

  let y;
</script>

<article>
  <p>
    When you hear the words “mass shooting,” which one comes to your mind first? America’s deadliest shooting in Las Vegas in 2017? The recent one in Atlanta, or one of the school shootings? Or one that happened where you live or one that affected you or your family, friends?
  </p>

  <div class="selection-container">
    <p>
      Tell me one tragedy you remember the most. I picked Las Vegas Strip massacre. You can keep it as Las Vegas too.
    </p>
    <div class="selections">
      <div class="selection active" data-id="91" on:click={selectShootingButton}>
        Las Vegas Strip massacre
      </div>
      <div class="selection" data-id="113" on:click={selectShootingButton}>
        El Paso Walmart shooting
      </div>
      <div class="selection" data-id="27" on:click={selectShootingButton}>
        Columbine High School massacre
      </div>
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
      {selectedD.case} happened in {selectedD.year} in {selectedD.city}, {selectedD.state}. {selectedD.fatalities} people were killed and {selectedD.injured === 1 ? "another person was" : ""}{selectedD.injured === 1 ? "" : selectedD.injured}{selectedD.injured === 1 ? "" : " others were"} wounded.
    </p>
  </div>

  <h2>
    How much was the <span class="selected-shooting">{selectedD.case}</span> reported, compared to other shootings?
  </h2>
  <p>
    Some of these may have been more memorable because they were reported more widely than others. In fact, there has been a big difference in coverage of mass shootings. While all these incidents are horrific, some attracted more media attention than the others.
  </p>
</article>

<div class="scroller-container">
  {#if y > 1500}
    <div class="navbar">
      You chose:
      <select bind:value={selectedValue} on:change={selectShootingDropdown}>
        {#each filteredD as d}
          <option value={d}>{d.case} ({d.year})</option>
        {/each}
      </select>
    </div>
  {/if}

<ScrollerContent1 data={data} selected={selectedD.id}/>
</div>

<article>
  <h2>Why is there a difference in the amount of coverage?</h2>
  <p>
    Why are some shootings covered more widely than the others? Is it because more people were victimized, or because it happened in a school and killed students? Or, is it because the shooters were middle-schoolers?
  </p>
</article>

<div class="scroller-container">
    <div class="navbar">
      You chose:
      <select bind:value={selectedValue} on:change={selectShootingDropdown}>
        {#each filteredD as d}
          <option value={d}>{d.case} ({d.year})</option>
        {/each}
      </select>
    </div>
<ScrollerContent2 data={data} selected={selectedD.id}/>

</div>

<Content3 />

<svelte:window bind:scrollY={y} />

<style>
  article {
    margin: 10em auto;
  }
  
  .selection-container {
    font-family: 'Fira Sans Condensed', sans-serif;
    line-height: 1.2;
    margin: 5em auto;
    text-align: center;
  }

  .selections {
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
  }

  .selection {
    width: 150px;
    height: 50px;
    padding: 0.3em 0.4em;
    display: flex;
    align-items: center;
    cursor: pointer;
    outline: 1px solid #eeeeee;
  }

  .selection:hover {
    color: white;
    outline: 1px solid rgba(255, 165, 0, 0.8);
    background: rgba(255, 165, 0, 0.8);
    transition: all 0.2s ease;
  }

  .active {
    color: white;
    outline: 1px solid rgba(255, 165, 0, 0.8);
    background: rgba(255, 165, 0, 0.8);
    cursor: unset;
  }

  .selection-dropdown {
    margin: 1em auto;
    position: relative;
  }

  span {
    color: white;
    background: rgba(255, 165, 0, 0.8);
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
    background: #222222;
    outline: 0px;
  }

  option {
    background: #222222;
  }

  .scroller-container {
    position: relative;
  }

  .navbar{
    height: 100px;
    width: 550px;
    font-family: 'Fira Sans Condensed', sans-serif;
    background: #222222;
    position: sticky;
    padding: 2em 0 0 0;
    top: 0;
    left: 0;
    z-index: 999;
  }
</style>