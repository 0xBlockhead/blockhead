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
	import BlockheadLogosBlockchainNodeStateView from '$/views/BlockheadLogosBlockchainNodeStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLogosBlockchainNodeState, data.selector, {
				sources: [
					Source.Local_Internal,
					Source.LogosBlockchainNode_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.peerId || 'blockhead Logos blockchain node state')} • blockhead Logos blockchain node state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead Logos blockchain node state'} • blockhead Logos blockchain node state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLogosBlockchainNodeState, data.selector, {
				sources: [
					Source.Local_Internal,
					Source.LogosBlockchainNode_Rest,
				],
			})}

	<BlockheadLogosBlockchainNodeStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
