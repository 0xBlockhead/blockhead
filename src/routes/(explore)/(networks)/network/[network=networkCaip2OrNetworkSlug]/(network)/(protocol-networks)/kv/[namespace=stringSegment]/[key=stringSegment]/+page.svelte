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
	import ZeroGKvEntryView from '$/views/ZeroGKvEntryView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ZeroGKvEntry, data.selector, {
				sources: [
					Source.ZeroGStorageNode_JsonRpc,
					Source.ZeroGStorageScan_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.key || 'zero g kv entry')} • zero g kv entry • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'zero g kv entry'} • zero g kv entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ZeroGKvEntry, data.selector, {
				sources: [
					Source.ZeroGStorageNode_JsonRpc,
					Source.ZeroGStorageScan_Rest,
				],
			})}

	<ZeroGKvEntryView
		selection={pageSelection}
	/>
	{/if}
</Page>
