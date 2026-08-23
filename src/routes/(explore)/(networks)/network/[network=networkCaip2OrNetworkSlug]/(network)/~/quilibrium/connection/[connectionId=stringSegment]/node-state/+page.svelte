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
	import BlockheadQuilibriumNodeStateView from '$/views/BlockheadQuilibriumNodeStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadQuilibriumNodeState, data.selector, {
				sources: [
					Source.Local_Internal,
					Source.QuilibriumNodeMetrics_Prometheus,
					Source.QuilibriumNode_Grpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.connectionId || 'blockhead quilibrium node state')} • blockhead quilibrium node state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead quilibrium node state'} • blockhead quilibrium node state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadQuilibriumNodeState, data.selector, {
				sources: [
					Source.Local_Internal,
					Source.QuilibriumNodeMetrics_Prometheus,
					Source.QuilibriumNode_Grpc,
				],
			})}

	<BlockheadQuilibriumNodeStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
