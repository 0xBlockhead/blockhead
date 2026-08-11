<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	import { evmAccountCandidatesFromSearchInput } from './entitySearch.ts'

	let {
		data,
	}: {
		data: {
			query: string
		}
	} = $props()

	const evmAccountCandidates = $derived(
		evmAccountCandidatesFromSearchInput(data.query)
	)
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
			Supported identifiers: CAIP-2 networks, CAIP-10 accounts, HTTP(S) URLs, .eth names, IPFS/IPNS URIs, and magnet URIs.
		</p>

		<button type="submit">Open entity</button>
	</form>

	{#if evmAccountCandidates.length}
		<section data-column="gap-2">
			<h2>Choose an EVM network</h2>

			<p>The address does not identify its network. Open it on one of the checked-in EVM networks:</p>

			<ul data-column="gap-1">
				{#each evmAccountCandidates as candidate (candidate.caip2)}
					<li>
						<a href={resolve(
							'/(explore)/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]',
							{
								namespace: candidate.namespace,
								reference: candidate.reference,
								accountAddress: candidate.accountAddress,
							}
						)}>
							{candidate.name}
							<span data-text="annotation">{candidate.caip2}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>
