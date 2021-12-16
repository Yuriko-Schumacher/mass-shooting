<div>
  <article>
    <h3>
      Methodology
    </h3>
    <h4>
      Why am I looking at The New York Times coverage?
    </h4>
    <p>
      I focused on The New York Times because it’s a historically widely-circulated national newspaper which widely reports issues throughout the country. Generally, local newspapers focus more on local issues. The Times focuses more on New York and around it, but Prof. Dan Zedek, and my second reader, Emily Boardman Ndulue, researcher at Media Cloud Project, and I decided the local biases are small enough. Availability of historical data and other tools such as New York Times API and Timesmachine were also major reasons to focus on The Times for this research.
    </p>
    <h4>
      Why am I tracking Times’ print coverage and excluding digital?
    </h4>
    <p>
      Since I’m analyzing data from the 1980s, where digital coverage was not the main focus of the paper, I’m only looking at print coverage until present. All copies of print issues are available on Timesmachine and ProQuest, whereas there are no packaged batches of online articles. Focusing only on print improved the accuracy of data collection and cleaning. Moreover, The Times’ decision on the rank of articles in print are historically widely considered by other U.S. news outlets, so we decided the paper’s decision-making on print should reflect the general trend in the news industry throughout the U.S.
    </p>
    <h4>
      How did I collect the data?
    </h4>
    <p>
      I gathered The New York Times’ article data by using ProQuest database through Northeastern Library. I set the query periods from the date the shooting happened and two weeks after that date. I used this two-week period because studies have shown that in general, newspapers stop reporting about shooting incidents after two weeks. Query terms are determined as: ([SHOOTING LOCATION] OR [SPECIFIC KEYWORD]) AND [GUN/SHOOTING-RELATED KEYWORDS]. Shooting locations are determined as: [CITY NAME] OR [STATE NAME] OR [STATE ABBREVIATION IN AP STYLE]. Specific keywords are terms such as “Walmart” or “IHOP,” which can be used, in reporting, to identify a specific shooting instead of geographic location. The list of specific keywords were come up by me and Emily Boardman Ndulue.
    </p>
    <p>
      Other variables such as shooter’s ages and shooting locations were downloaded from Mother Jones’ database and occasionally fixed with the information provided by database by The Violence Project. The fatal victim’s ages were scraped from Voice of America’s list of victims. The missing data about the victim's ages were manually filled in by Yuriko Schumacher.
    </p>
    <h4>
      How did I clean the data?
    </h4>
    <p>
      The collected data had almost no false negatives, but a huge amount of false positives. I first converted the text data exported from ProQuest into the spreadsheet format (one row = one article). I then manually went through every article one by one. For each article, I 1) checked if the published date is within the two-week time period, 2) read the headline, 3) looked for query terms (shooting location, specific keywords, and gun/shooting-related keywords) in the body text and 4) decided if the article is about the shooting or just one that mentions the shooting, and if it should be included in the research or not. Additionally, for those I found should be included in the research, I looked at the copy of the paper and confirmed the section and the first page where the article appeared in the paper. Through this process, I obtained a total of 2,517 articles including those that only mention the shooting. Ten percent of those articles were confirmed by Emily Boardman Ndulue.
    </p>
  </article>
</div>

<style>
  div {
    background: lightgray;
    color: #222222;
    font-size: 0.8rem;
  }

  article {
    margin: 0 auto;
    padding: 5rem 2rem;
  }

  h4 {
    line-height: 1;
    margin: 2em 0 0 0;
  }
</style>