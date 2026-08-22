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

	const pageSelection = $derived(select(EntityType.BlockheadMoneroSubaddressState_Timestamp, {
		$subaddressState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadMoneroSubaddressState_TimestampView from '$/views/BlockheadMoneroSubaddressState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead monero subaddress state timestamp')} • blockhead monero subaddress state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadMoneroSubaddressState_TimestampView
		selection={pageSelection}
	/>
</Page>
