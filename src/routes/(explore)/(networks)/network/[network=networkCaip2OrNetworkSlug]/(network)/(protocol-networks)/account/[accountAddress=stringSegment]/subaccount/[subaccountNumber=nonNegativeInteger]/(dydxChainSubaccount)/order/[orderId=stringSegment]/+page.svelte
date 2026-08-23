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


	// Components
	import Page from '$/components/Page.svelte'
	import DydxChainOrderView from '$/views/DydxChainOrderView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.DydxChainOrder, data.selector, {
				sources: [
					Source.DydxIndexer,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.orderId || 'dydx chain order')} • dydx chain order • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'dydx chain order'} • dydx chain order • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.DydxChainOrder, data.selector, {
				sources: [
					Source.DydxIndexer,
				],
			})}

	<DydxChainOrderView
		selection={pageSelection}
	/>
	{/if}
</Page>
