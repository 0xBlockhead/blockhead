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
	import BlockheadRadiclePeerView from '$/views/BlockheadRadiclePeerView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadRadiclePeer, {
				$node: data.selector,
				peerNodeId: params.peerNodeId,
			}, {
				sources: [
					Source.Local_Internal,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.peerNodeId || 'blockhead radicle peer')} • blockhead radicle peer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead radicle peer'} • blockhead radicle peer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadRadiclePeer, {
				$node: data.selector,
				peerNodeId: params.peerNodeId,
			}, {
				sources: [
					Source.Local_Internal,
				],
			})}

	<BlockheadRadiclePeerView
		selection={pageSelection}
	/>
	{/if}
</Page>
