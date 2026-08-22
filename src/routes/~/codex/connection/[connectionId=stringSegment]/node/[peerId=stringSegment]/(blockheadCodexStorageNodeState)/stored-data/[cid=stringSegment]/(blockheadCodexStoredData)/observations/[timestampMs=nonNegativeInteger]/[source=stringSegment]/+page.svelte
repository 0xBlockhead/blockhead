<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadCodexStoredData_Timestamp, {
		$storedData: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCodexStoredData_TimestampView from '$/views/BlockheadCodexStoredData_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead codex stored data timestamp')} • blockhead codex stored data timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadCodexStoredData_TimestampView
		selection={pageSelection}
	/>
</Page>
