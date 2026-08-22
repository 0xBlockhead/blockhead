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

	const pageSelection = $derived(select(EntityType.BlockheadWakuNodeState_Timestamp, {
		$nodeState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWakuNodeState_TimestampView from '$/views/BlockheadWakuNodeState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead waku node state timestamp')} • blockhead waku node state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWakuNodeState_TimestampView
		selection={pageSelection}
	/>
</Page>
