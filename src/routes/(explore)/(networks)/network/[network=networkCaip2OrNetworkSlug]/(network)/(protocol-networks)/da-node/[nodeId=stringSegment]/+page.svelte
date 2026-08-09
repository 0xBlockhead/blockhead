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

	const pageSelection = $derived(select(EntityType.ZeroGDaNode, data.selector, {
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
	<title>{data.title ?? (pageSelection.entitySelector.nodeId || 'zero g da node')} • zero g da node • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGDaNodeView
		selection={pageSelection}
	/>
</Page>
