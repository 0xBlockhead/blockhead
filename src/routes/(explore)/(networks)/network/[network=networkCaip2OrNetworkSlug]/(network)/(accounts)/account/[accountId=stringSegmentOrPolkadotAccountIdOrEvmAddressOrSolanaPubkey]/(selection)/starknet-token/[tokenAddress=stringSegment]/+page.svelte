<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StarknetTokenHolding, data.selector, {
		sources: [
			Source.Starkscan,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetTokenHoldingView from '$/views/StarknetTokenHoldingView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'starknet token holding'} • starknet token holding • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'starknet token holding'} • starknet token holding • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StarknetTokenHoldingView
		selection={pageSelection}
	/>
	{/if}
</Page>
