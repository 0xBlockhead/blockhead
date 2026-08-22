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

	const pageSelection = $derived(select(EntityType.BitcoinMiningPool_Timestamp, {
		$pool: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinMiningPool_TimestampView from '$/views/BitcoinMiningPool_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Bitcoin mining pool observation')} • Bitcoin mining pool observation • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinMiningPool_TimestampView
		selection={pageSelection}
	/>
</Page>
