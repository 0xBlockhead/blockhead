<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.DydxChainOrder, data.selector, {
		sources: [
			Source.DydxIndexer,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import DydxChainOrderView from '$/views/DydxChainOrderView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.orderId || 'dydx chain order')} • dydx chain order • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'dydx chain order'} • dydx chain order • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<DydxChainOrderView
		selection={pageSelection}
	/>
	{/if}
</Page>
