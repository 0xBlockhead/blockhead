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

	const pageSelection = $derived(select(EntityType.ZeroGKvEntry, data.selector, {
		sources: [
			Source.ZeroGStorageNode_JsonRpc,
			Source.ZeroGStorageScan_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGKvEntryView from '$/views/ZeroGKvEntryView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.key || 'zero g kv entry')} • zero g kv entry • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGKvEntryView
		selection={pageSelection}
	/>
</Page>
