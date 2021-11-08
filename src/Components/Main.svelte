<script>
  import * as d3 from 'd3';
  import ScrollerContent1 from './ScrollerContent1.svelte'
  import ScrollerContent2 from './ScrollerContent2.svelte'

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
    return b.fatalities - a.fatalities;
  });
  parseData(data);

  let filteredD = data.filter(d => d.total_front_page !== "NA")
  
  let selectedId = 91;
  let selectedD = data.filter(d => d.id == 91)[0].case;
  let selectedValue;
  const selectShooting = () => {
    selectedD = selectedValue.case;
    selectedId = selectedValue.id;
  }
</script>

<article>
  <p>
    When you hear the words “mass shooting,” which one comes to your mind first? America’s deadliest shooting in Las Vegas in 2017? The recent one in Atlanta, or one of the school shootings? Or one that happened where you live or one that affected you or your family, friends?
  </p>
  <p>
    Some of these may have been memorable because they were reported more widely than others. In fact, there has been a big difference in coverage of mass shootings. While all these incidents are horrific, some attracted more media attention than the others.
  </p>
  <br><br>
  <h2>
    How much was the <span class="selected-shooting">{selectedD}</span> reported, compared to other shootings?
  </h2>
  <div>
    <p>Select another shooting to highlight</p>
    <select bind:value={selectedValue} on:change={selectShooting}>
      {#each filteredD as d}
        <option value={d}>{d.case}</option>
      {/each}
    </select>
  </div>
</article>

<ScrollerContent1 data={data} selected={selectedId}/>

<div>
  <p>Change your selection</p>
  <select bind:value={selectedValue} on:change={selectShooting}>
    {#each filteredD as d}
      <option value={d}>{d.case}</option>
    {/each}
  </select>
</div>

<article>
  <h2>Why is there a difference in the amount of coverage?</h2>
  <p>
    Why are some shootings covered more widely than the others? Is it because more people were victimized, or because it happened in a school and killed students? Or, is it because the shooters were middle-schoolers?
  </p>
</article>

<ScrollerContent2 data={data} selected={selectedId}/>

<article>
  <h3>
    Is it who were the shooters? Or who were the victims?
  </h3>
  <p>
    In late 1990s, school shootings happened in a row and issues regarding minor shooters were widely discussed on the paper. School shootings tend to be reported widely, and in most of those cases perpetrators or victims are children or young people. Are these tendencies always true? Are there exceptions?
  </p>
  <p>
    Suspects in most reported shootings tend to be in or around their 20s. The youngest suspect ever was an 11-year-old boy who, with another boy, 13, shot their peers and teachers in their middle school in Jonesboro, Ark. in 1998. This was covered relatively widely, with about 25,000 words and a total of 35 articles. The oldest suspect was a 66-year-old fired employee who opened fire at his former workplace in Melrose Park, Ill., in 2001. He killed five people and injured four others, which generated 1661 words in The Times print edition. As you can see, shootings by middle-aged or older perpetrators are rarely reported most widely. 
  </p>
  <p>
    The victim’s age somewhat explains the difference in the amount of coverage. This chart shows the fatal victim's age and the number of articles by The Times. There are clusters of young victims in Newtown (Sandy Hook), Littleton (Columbine), and Blacksburg (Virginia Tech) shootings. All happened in school, and students were victimized. There are other shootings that weren’t reported widely with young victims, such as the one in Gilroy, Calif., where a 6-year-old, as well as a 13-year-old and 25-year-old were killed, and 15 others were injured. This shooting was only reported with a little more than 4500 words. Another exception may be the Amish school shooting in Lancaster County, Penn. in 2006, where five young girls were shot dead.
  </p>
  <p>
    Victim’s age is related to the amount of coverage in some cases, but not others. Main exceptions are ones in El Paso and Tucson. However, these two had characteristic victims: mostly Latino/as in the former, and a congresswoman in the latter.
  </p>
  <p>
    On the other hand, when victims were shooters’ former colleagues/bosses, girlfriends, families, these shootings don’t generate too much coverage. Who was victimized seems to be a substantial factor in the coverage of mass shootings.
  </p>
</article>

<article>
  <h3>
    Is it because it was labeled as an act of hate or terrorism?
  </h3>
  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non tenetur doloribus dolore consequuntur nihil, architecto, reprehenderit at fugit, perferendis unde officia assumenda? Tempora voluptatum repellat eligendi harum accusamus fuga quos.
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex consequuntur magni rerum ut labore quod corporis iusto hic culpa in. Optio porro iusto rem corporis veniam repellat velit ex vitae?
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium, labore quos magnam debitis maxime cumque voluptate corporis, perferendis repellat enim impedit sequi hic recusandae! Aspernatur sunt architecto sequi? Quaerat, aperiam?
  </p>
</article>

<article>
  <h3>
    Or something else?
  </h3>
  <p>
    There can be other reasons why some shootings were reported more widely than others by The New York Times. One big factor can be the geological distance from New York. Naturally, The New York Times focuses more on the news in and around New York, or, more on the East Coast than the West Coast. The paper also has a “New York” section, where news from New York and states around it.
  </p>
  <p>
    Another factor can be whether there was another shooting right before or after the shooting. __________[something like “When the same things happen again in a short period of time, they gain more news coverage,” by an expert]__________. An example is the shooting in Dayton, Ohio in 2019, which happened a day after the El Paso shooting. These two were often reported together.
  </p>
  <p>
    Since all shootings are very different from each other, it is difficult to find a single answer to “Why do some shootings matter more than the others?” Although the number of victims, shooting locations, the ages or characteristics of shooters and victims contribute in some ways, they are complicatedly related to each other and other factors. Perhaps there was another big news on the same day and there was a reduction of the coverage about the shooting, or vice versa.
  </p>
</article>

<style>
  article {
    margin: 10em auto;
  }

  span {
    color: white;
    background: rgba(255, 165, 0, 0.8);
    padding: 0 0.3em;
  }

  select {
    cursor: pointer;
  }

  select:focus {
    outline: none;
  }
</style>