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
	import BlockheadLightningNodeStateView from '$/views/BlockheadLightningNodeStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLightningNodeState, data.selector, {
				sources: [
					Source.LightningLnd_Rest,
					Source.Local_Internal,
				],
				fields: {
					alias: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.connectionId ?? '') || 'local LND node state' : (pageSelection.entity.alias ?? '') || pageSelection.entitySelector.connectionId || 'local LND node state')} • local LND node state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'local LND node state'} • local LND node state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLightningNodeState, data.selector, {
				sources: [
					Source.LightningLnd_Rest,
					Source.Local_Internal,
				],
				fields: {
					alias: true,
				},
			})}

	<BlockheadLightningNodeStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
