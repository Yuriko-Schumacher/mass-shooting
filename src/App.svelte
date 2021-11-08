<script>
  import * as d3 from 'd3';

  import Header from './Components/Header.svelte'
  import Title from './Components/Title.svelte'
  import Main from './Components/Main.svelte'
  import Methodology from './Components/Methdology.svelte'
  import Footer from './Components/Footer.svelte'

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

<Footer />

<style>
	main {
		background: var(--bg-gray);
		color: var(--font-white);
		padding: 10em 5em;
	}

</style>