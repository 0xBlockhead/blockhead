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
	import BlockheadQuilibriumAccountStateView from '$/views/BlockheadQuilibriumAccountStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadQuilibriumAccountState, data.selector, {
				sources: [
					Source.Local_Internal,
					Source.QuilibriumNodeRpc_Grpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.accountAddress || 'blockhead quilibrium account state')} • blockhead quilibrium account state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead quilibrium account state'} • blockhead quilibrium account state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadQuilibriumAccountState, data.selector, {
				sources: [
					Source.Local_Internal,
					Source.QuilibriumNodeRpc_Grpc,
				],
			})}

	<BlockheadQuilibriumAccountStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
