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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ZeroGDaNode, data.selector, {
		sources: [
			Source.ZeroGChainScan_Rest,
			Source.ZeroGStorageNode_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGDaNodeView from '$/views/ZeroGDaNodeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'zero g da node')} • zero g da node • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'zero g da node'} • zero g da node • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ZeroGDaNodeView
		selection={pageSelection}
	/>
	{/if}
</Page>
