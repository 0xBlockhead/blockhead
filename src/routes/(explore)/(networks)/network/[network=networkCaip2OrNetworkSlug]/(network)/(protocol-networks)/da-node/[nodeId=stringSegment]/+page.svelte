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
	import ZeroGDaNodeView from '$/views/ZeroGDaNodeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ZeroGDaNode, data.selector, {
				sources: [
					Source.ZeroGChainScan_Rest,
					Source.ZeroGStorageNode_JsonRpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'zero g da node')} • zero g da node • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'zero g da node'} • zero g da node • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ZeroGDaNode, data.selector, {
				sources: [
					Source.ZeroGChainScan_Rest,
					Source.ZeroGStorageNode_JsonRpc,
				],
			})}

	<ZeroGDaNodeView
		selection={pageSelection}
	/>
	{/if}
</Page>
