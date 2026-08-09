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

	const pageSelection = $derived(select(EntityType.BlockheadZeroGStorageNodeState, data.selector, {
		sources: [
			Source.Local_Internal,
			Source.ZeroGStorageNode_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadZeroGStorageNodeStateView from '$/views/BlockheadZeroGStorageNodeStateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.nodeId || 'blockhead zero g storage node state')} • blockhead zero g storage node state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadZeroGStorageNodeStateView
		selection={pageSelection}
	/>
</Page>
