<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		data,
	}: {
		data: {
			query: string
		}
	} = $props()
</script>


<svelte:head>
	<title>Open an entity • Blockhead</title>
</svelte:head>


<main
	id="main"
	data-page="centered"
	data-column="gap-4"
>
	<header data-column="gap-1">
		<h1>Open an entity</h1>

		{#if data.query}
			<p role="alert">
				“{data.query}” is ambiguous or unsupported. Include a canonical namespace or use a supported identifier.
			</p>
		{:else}
			<p>Enter a canonical identifier.</p>
		{/if}
	</header>

	<form
		action={resolve('/open')}
		method="get"
		data-column="gap-2"
	>
		<label for="open-entity-query">Identifier</label>

		<input
			id="open-entity-query"
			name="q"
			type="search"
			value={data.query}
			placeholder="eip155:1:0x…"
			autocomplete="off"
			enterkeyhint="go"
			required
			aria-describedby="open-entity-help"
		/>

		<p id="open-entity-help">
			Supported identifiers: CAIP-2 networks, CAIP-10 accounts, HTTP(S) URLs, and .eth names.
		</p>

		<button type="submit">Open entity</button>
	</form>
</main>
