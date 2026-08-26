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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadZeroGStorageNodeState, data.selector, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'blockhead zero g storage node state')} • blockhead zero g storage node state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead zero g storage node state'} • blockhead zero g storage node state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadZeroGStorageNodeStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
