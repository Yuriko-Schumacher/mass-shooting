<script>
  export let data;
  let sourcePath;
  const unavailable = [47, 72, 87, 89, 92, 96, 98, 102, 103, 104, 107, 108, 109, 112, 118, 119, 122]
  let isUnavailable;
  $: sourcePath = `./assets/copies/${data.id}.svg`
  $: isUnavailable = unavailable.includes(data.id);
</script>

<div>
{#if isUnavailable}
  <div class="placeholder">
    <p>Image is not available.</p>
  </div>
{:else}
  <img width="300" src={sourcePath} alt="Copy of the first major reporting of the selected shooting by The New York Times">
{/if}
</div>

<style>
  div {
    display: flex;
    justify-content: center;
  }

  .placeholder {
    font-family: 'Fira Sans Condensed', sans-serif;
    width: 300px;
    height: 540px;
    background: rgba(128, 128, 128, 0.3);
    text-align: center;
    align-items: center;
  }
</style>