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
	import ZeroGDataBlobView from '$/views/ZeroGDataBlobView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ZeroGDataBlob, data.selector, {
				sources: [
					Source.ZeroGStorageScan_Rest,
					Source.ZeroGStorageNode_JsonRpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.dataRoot || 'zero g data blob')} • zero g data blob • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'zero g data blob'} • zero g data blob • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ZeroGDataBlob, data.selector, {
				sources: [
					Source.ZeroGStorageScan_Rest,
					Source.ZeroGStorageNode_JsonRpc,
				],
			})}

	<ZeroGDataBlobView
		selection={pageSelection}
	/>
	{/if}
</Page>
