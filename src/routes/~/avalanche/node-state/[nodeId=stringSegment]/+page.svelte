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
	import BlockheadAvalancheNodeStateView from '$/views/BlockheadAvalancheNodeStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadAvalancheNodeState, data.selector, {
				sources: [
					Source.AvalancheInfo_JsonRpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'blockhead avalanche node state')} • blockhead avalanche node state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead avalanche node state'} • blockhead avalanche node state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadAvalancheNodeState, data.selector, {
				sources: [
					Source.AvalancheInfo_JsonRpc,
				],
			})}

	<BlockheadAvalancheNodeStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
