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
	import BlockheadCodexStoredDataView from '$/views/BlockheadCodexStoredDataView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCodexStoredData, data.selector, {
				sources: [
					Source.Local_Internal,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.cid || 'blockhead codex stored data')} • blockhead codex stored data • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead codex stored data'} • blockhead codex stored data • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCodexStoredData, data.selector, {
				sources: [
					Source.Local_Internal,
				],
			})}

	<BlockheadCodexStoredDataView
		selection={pageSelection}
	/>
	{/if}
</Page>
