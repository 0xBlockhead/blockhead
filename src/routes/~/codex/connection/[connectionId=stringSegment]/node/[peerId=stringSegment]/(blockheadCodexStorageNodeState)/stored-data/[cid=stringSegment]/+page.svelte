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

	const pageSelection = $derived(select(EntityType.BlockheadCodexStoredData, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCodexStoredDataView from '$/views/BlockheadCodexStoredDataView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.cid || 'blockhead codex stored data')} • blockhead codex stored data • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadCodexStoredDataView
		selection={pageSelection}
	/>
</Page>
