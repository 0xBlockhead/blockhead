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

	const pageSelection = $derived(select(EntityType.BlockheadLightningChannelState_Timestamp, {
		$channelState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningChannelState_TimestampView from '$/views/BlockheadLightningChannelState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'local LND channel-state observation')} • local LND channel-state observation • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningChannelState_TimestampView
		selection={pageSelection}
	/>
</Page>
