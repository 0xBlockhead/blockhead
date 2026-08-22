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

	const pageSelection = $derived(select(EntityType.BlockheadMoneroOutputState_Timestamp, {
		$outputState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadMoneroOutputState_TimestampView from '$/views/BlockheadMoneroOutputState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead monero output state timestamp')} • blockhead monero output state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadMoneroOutputState_TimestampView
		selection={pageSelection}
	/>
</Page>
