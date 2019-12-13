<script lang="ts">
  export let name: string
  let data = {}
  $: {
    document.title = name
    fetch(`https://day.ebichu.cc/api/${name}`)
      .then(res => {
        if (res.ok) {
          return res
        }
        throw res
      })
      .then(res => res.json(), (err) => console.error('hhhhh', err))
      .then(res => {
        if (res) {
          data = res
        }
      })
    new Promise((resolve) => {
      setTimeout(resolve.bind(null, `${name.toUpperCase()} is inputted before 3s.`), 3000)
    }).then(console.log)
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