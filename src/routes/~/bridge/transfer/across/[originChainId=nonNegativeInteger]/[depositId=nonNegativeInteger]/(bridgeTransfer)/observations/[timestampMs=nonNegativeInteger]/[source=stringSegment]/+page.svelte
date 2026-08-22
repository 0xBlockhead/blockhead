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

	const pageSelection = $derived(select(EntityType.BridgeTransfer_Timestamp, {
		$transfer: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeTransfer_TimestampView from '$/views/BridgeTransfer_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'bridge transfer timestamp')} • bridge transfer timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BridgeTransfer_TimestampView
		selection={pageSelection}
	/>
</Page>
