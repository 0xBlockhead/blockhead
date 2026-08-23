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
	import BlockheadKaspaNodeStateView from '$/views/BlockheadKaspaNodeStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadKaspaNodeState, data.selector, {
				sources: [
					Source.Local_Internal,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.connectionId || 'blockhead kaspa node state')} • blockhead kaspa node state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead kaspa node state'} • blockhead kaspa node state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadKaspaNodeState, data.selector, {
				sources: [
					Source.Local_Internal,
				],
			})}

	<BlockheadKaspaNodeStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
