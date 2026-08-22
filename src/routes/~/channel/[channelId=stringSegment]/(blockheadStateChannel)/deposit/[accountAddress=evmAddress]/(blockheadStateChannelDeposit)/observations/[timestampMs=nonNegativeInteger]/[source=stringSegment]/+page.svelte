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

	const pageSelection = $derived(select(EntityType.BlockheadStateChannelDeposit_Timestamp, {
		$deposit: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadStateChannelDeposit_TimestampView from '$/views/BlockheadStateChannelDeposit_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead state channel deposit timestamp')} • blockhead state channel deposit timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadStateChannelDeposit_TimestampView
		selection={pageSelection}
	/>
</Page>
