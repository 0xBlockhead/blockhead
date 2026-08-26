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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadQuilibriumNodeState, data.selector, {
		sources: [
			Source.Local_Internal,
			Source.QuilibriumNodeMetrics_Prometheus,
			Source.QuilibriumNode_Grpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadQuilibriumNodeStateView from '$/views/BlockheadQuilibriumNodeStateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.connectionId || 'blockhead quilibrium node state')} • blockhead quilibrium node state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead quilibrium node state'} • blockhead quilibrium node state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadQuilibriumNodeStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
