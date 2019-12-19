<script lang="ts">
  import { Subject, from, of, } from 'rxjs'
  import {
    distinctUntilChanged,
    throttleTime,
    switchMap,
    catchError,
    bufferCount,
    filter,
    scan,
    share,
  } from 'rxjs/operators'

  function fetchDay(day: number) {
    return fetch(`https://day.ebichu.cc/api/${day}`)
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw res
      })
      .then(
        (res) => ({ type: 'success', day, data: res }),
        (err) => { throw { err, day } }
      )
  }

  export let name: string
  let day: number
  const day$ = new Subject<number>()

  const result$ = day$.pipe(
    throttleTime(700),
    filter(v => !!v),
    distinctUntilChanged(),
    switchMap((v) => {
      return from(fetchDay(v)).pipe(
        catchError(({ day, err }) => of({
          type: 'failed',
          error: String(err),
          day
        }))
      )
    }),
    share()
  )
  const buffered = result$.pipe(bufferCount(5))
  const bufferedCount = result$.pipe(scan((acc, v) => ++acc, 0))

  $: {
    document.title = `${name} - Day ${day}`
    day$.next(day)
  }

</script>

<style type="scss">
  $pink: rgba(247, 4, 247, 0.2);
  h1 {
    color: $pink;
  }
</style>

<h1>Hello {@html name}!!!</h1>
<input bind:value={day} type="number">
{#if $buffered}
  <ul>
    {#each $buffered as item (item.day)}
      <h3>Day: {item.day}</h3>
      <pre>{JSON.stringify(item.data, null, 2)}</pre>
    {/each}
  </ul>
{:else}
  <p>Nothing. Need {5 - $bufferedCount % 5 || 5} times.</p>
{/if}