<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SolanaProgram, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.programId || 'solana program')} • solana program • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'solana program'} • solana program • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SolanaProgramView
		selection={pageSelection}
	/>
	{/if}
</Page>
