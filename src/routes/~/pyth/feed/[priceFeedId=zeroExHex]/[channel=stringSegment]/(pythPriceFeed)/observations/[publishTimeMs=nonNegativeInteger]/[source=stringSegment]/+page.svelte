<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.PythPriceFeed_Timestamp, {
		$feed: {
			priceFeedId: params.priceFeedId,
			channel: params.channel,
		},
		publishTimeMs: Number(params.publishTimeMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PythPriceFeed_TimestampView from '$/views/PythPriceFeed_TimestampView.svelte'
</script>


<svelte:head>
	<title>{String(pageSelection.entitySelector.publishTimeMs) || 'Pyth price feed timestamp'} • Pyth price feed timestamp • Blockhead</title>
</svelte:head>


<Page>
	<PythPriceFeed_TimestampView
		selection={pageSelection}
	/>
</Page>
