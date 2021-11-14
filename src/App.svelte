<script>
  import * as d3 from 'd3';

  import Header from './Components/Header.svelte'
  import Title from './Components/Title.svelte'
  import Main from './Components/Main.svelte'
  import Methodology from './Components/Methdology.svelte'
  import Footer from './Components/Footer.svelte'
  import SpecialThanks from './Components/SpecialThanks.svelte';

  export let nytMergedD = [];
  
  let promise = getData();

  async function getData() {
    nytMergedD = await d3.csv("data/nyt_merged.csv")
  }
</script>

<Header />

<main>
  <Title />
  {#await promise then data} 
    <Main data={nytMergedD} />
  {/await}
</main>

<Methodology />

<SpecialThanks />

<Footer />

<style>

	main {
		padding: 10em 0;
    width: 90%;
    margin: 0 auto;
	}

</style>