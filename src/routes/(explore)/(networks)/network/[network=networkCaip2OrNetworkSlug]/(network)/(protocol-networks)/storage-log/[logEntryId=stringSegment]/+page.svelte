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

	const pageSelection = $derived(select(EntityType.ZeroGStorageLogEntry, data.selector, {
		sources: [
			Source.ZeroGStorageScan_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGStorageLogEntryView from '$/views/ZeroGStorageLogEntryView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.logEntryId || 'zero g storage log entry')} • zero g storage log entry • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGStorageLogEntryView
		selection={pageSelection}
	/>
</Page>
