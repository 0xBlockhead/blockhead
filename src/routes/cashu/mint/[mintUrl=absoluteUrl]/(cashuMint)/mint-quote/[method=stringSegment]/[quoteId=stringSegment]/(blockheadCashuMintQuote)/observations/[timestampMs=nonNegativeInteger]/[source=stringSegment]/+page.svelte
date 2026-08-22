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

	const pageSelection = $derived(select(EntityType.BlockheadCashuMintQuote_Timestamp, {
		$mintQuote: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuMintQuote_TimestampView from '$/views/BlockheadCashuMintQuote_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead Cashu mint quote timestamp')} • blockhead Cashu mint quote timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadCashuMintQuote_TimestampView
		selection={pageSelection}
	/>
</Page>
