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

	const pageSelection = $derived(select(EntityType.BlockheadAvalancheNodeState_Timestamp, {
		$nodeState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAvalancheNodeState_TimestampView from '$/views/BlockheadAvalancheNodeState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead avalanche node state timestamp')} • blockhead avalanche node state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAvalancheNodeState_TimestampView
		selection={pageSelection}
	/>
</Page>
