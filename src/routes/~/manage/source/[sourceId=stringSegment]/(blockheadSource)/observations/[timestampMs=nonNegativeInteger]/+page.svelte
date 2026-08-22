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

	const pageSelection = $derived(select(EntityType.BlockheadSource_Timestamp, {
		$source: data.selector,
		timestampMs: Number(params.timestampMs),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSource_TimestampView from '$/views/BlockheadSource_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead source timestamp')} • blockhead source timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSource_TimestampView
		selection={pageSelection}
	/>
</Page>
