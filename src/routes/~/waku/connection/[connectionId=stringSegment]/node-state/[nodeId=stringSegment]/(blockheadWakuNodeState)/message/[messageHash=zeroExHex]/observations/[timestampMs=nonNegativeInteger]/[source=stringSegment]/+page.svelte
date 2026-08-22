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

	const pageSelection = $derived(select(EntityType.BlockheadWakuMessageObservation_Timestamp, {
		$nodeState: data.selector,
		messageHash: params.messageHash,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWakuMessageObservation_TimestampView from '$/views/BlockheadWakuMessageObservation_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.messageHash || 'blockhead waku message observation timestamp')} • blockhead waku message observation timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWakuMessageObservation_TimestampView
		selection={pageSelection}
	/>
</Page>
