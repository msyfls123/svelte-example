<script lang="ts">
  export let name: string
  let data = {}
  $: {
    document.title = name
    fetch(`https://day.ebichu.cc/api/${name}`)
    .then(res => res.json())
    .then((res) => {
      data = res
    })
    Promise.resolve(123).then(console.log)
  }
</script>

<style type="scss">
  $pink: rgba(#112, .2);
  h1 {
    color: $pink;
  }
</style>

<h1>Hello {@html name}!!!</h1>
<input bind:value={name}>
<pre>{JSON.stringify(data, null, 2)}</pre>