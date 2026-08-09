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

	const pageSelection = $derived(select(EntityType.BlockheadQuilibriumNodeState_Timestamp, {
		$nodeState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadQuilibriumNodeState_TimestampView from '$/views/BlockheadQuilibriumNodeState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead quilibrium node state timestamp')} • blockhead quilibrium node state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadQuilibriumNodeState_TimestampView
		selection={pageSelection}
	/>
</Page>
