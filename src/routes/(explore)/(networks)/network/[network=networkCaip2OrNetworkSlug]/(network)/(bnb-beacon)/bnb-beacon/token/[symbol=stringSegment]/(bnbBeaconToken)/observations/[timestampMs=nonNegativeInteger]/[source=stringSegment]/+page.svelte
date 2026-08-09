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

	const pageSelection = $derived(select(EntityType.BnbBeaconToken_Timestamp, {
		$token: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BnbBeaconToken_TimestampView from '$/views/BnbBeaconToken_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'bnb beacon token timestamp')} • bnb beacon token timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BnbBeaconToken_TimestampView
		selection={pageSelection}
	/>
</Page>
