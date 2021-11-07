<script>
  import Header from './Header.svelte'
  import Footer from './Footer.svelte'

	export let name;
</script>

<Header />

<main>
	<h1>Which mass shootings matter, and why?</h1>
  <p>By {name}</p>
</main>

<Footer />

<style>
	main {
		background: var(--bg-gray);
		color: var(--font-white);
		padding: 10em 5em;
	}

</style>