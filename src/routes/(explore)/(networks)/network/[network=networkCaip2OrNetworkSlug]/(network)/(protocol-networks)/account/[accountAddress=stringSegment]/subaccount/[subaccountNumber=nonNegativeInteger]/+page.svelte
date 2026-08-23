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
	import DydxChainSubaccountView from '$/views/DydxChainSubaccountView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.DydxChainSubaccount, data.selector, {
				sources: [
					Source.DydxIndexer,
					Source.KingnodesDydxNode,
				],
			})}
		<title>{data?.title ?? 'dydx chain subaccount'} • dydx chain subaccount • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'dydx chain subaccount'} • dydx chain subaccount • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.DydxChainSubaccount, data.selector, {
				sources: [
					Source.DydxIndexer,
					Source.KingnodesDydxNode,
				],
			})}

	<DydxChainSubaccountView
		selection={pageSelection}
	/>
	{/if}
</Page>
