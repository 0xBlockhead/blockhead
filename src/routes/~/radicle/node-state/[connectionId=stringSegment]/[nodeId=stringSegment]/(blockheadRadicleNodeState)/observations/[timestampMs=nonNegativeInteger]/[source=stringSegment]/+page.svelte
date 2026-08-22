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

	const pageSelection = $derived(select(EntityType.BlockheadRadicleNodeState_Timestamp, {
		$nodeState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRadicleNodeState_TimestampView from '$/views/BlockheadRadicleNodeState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead radicle node state timestamp')} • blockhead radicle node state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadRadicleNodeState_TimestampView
		selection={pageSelection}
	/>
</Page>
