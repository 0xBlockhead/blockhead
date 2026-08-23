<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadZeroGStorageNodeStateView from '$/views/BlockheadZeroGStorageNodeStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadZeroGStorageNodeState, data.selector, {
					sources: [
						Source.Local_Internal,
						Source.ZeroGStorageNode_JsonRpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'blockhead zero g storage node state')} • blockhead zero g storage node state • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead zero g storage node state'} • blockhead zero g storage node state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadZeroGStorageNodeState, data.selector, {
					sources: [
						Source.Local_Internal,
						Source.ZeroGStorageNode_JsonRpc,
					],
				}))}

		<BlockheadZeroGStorageNodeStateView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
