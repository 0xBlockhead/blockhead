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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadZeroGStoredChunkView from '$/views/BlockheadZeroGStoredChunkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadZeroGStoredChunk, {
				$nodeState: data.selector,
				dataRoot: params.dataRoot,
				chunkIndex: Number(params.chunkIndex),
			}, {
				sources: [
					Source.Local_Internal,
					Source.ZeroGStorageNode_JsonRpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.dataRoot || 'blockhead zero g stored chunk')} • blockhead zero g stored chunk • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead zero g stored chunk'} • blockhead zero g stored chunk • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadZeroGStoredChunk, {
				$nodeState: data.selector,
				dataRoot: params.dataRoot,
				chunkIndex: Number(params.chunkIndex),
			}, {
				sources: [
					Source.Local_Internal,
					Source.ZeroGStorageNode_JsonRpc,
				],
			})}

	<BlockheadZeroGStoredChunkView
		selection={pageSelection}
	/>
	{/if}
</Page>
