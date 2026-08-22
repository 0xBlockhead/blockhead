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

	const pageSelection = $derived(select(EntityType.BnbBeaconNetwork_Timestamp, {
		$network: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BnbBeaconNetwork_TimestampView from '$/views/BnbBeaconNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'bnb beacon network timestamp')} • bnb beacon network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BnbBeaconNetwork_TimestampView
		selection={pageSelection}
	/>
</Page>
