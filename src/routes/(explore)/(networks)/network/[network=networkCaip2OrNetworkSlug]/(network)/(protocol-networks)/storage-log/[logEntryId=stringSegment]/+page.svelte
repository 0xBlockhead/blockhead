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
	import ZeroGStorageLogEntryView from '$/views/ZeroGStorageLogEntryView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ZeroGStorageLogEntry, data.selector, {
				sources: [
					Source.ZeroGStorageScan_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.logEntryId || 'zero g storage log entry')} • zero g storage log entry • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'zero g storage log entry'} • zero g storage log entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ZeroGStorageLogEntry, data.selector, {
				sources: [
					Source.ZeroGStorageScan_Rest,
				],
			})}

	<ZeroGStorageLogEntryView
		selection={pageSelection}
	/>
	{/if}
</Page>
