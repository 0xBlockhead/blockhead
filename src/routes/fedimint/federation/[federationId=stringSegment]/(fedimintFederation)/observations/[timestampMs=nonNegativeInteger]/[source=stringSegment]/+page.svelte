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

	const pageSelection = $derived(select(EntityType.FedimintFederation_Timestamp, {
		$federation: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FedimintFederation_TimestampView from '$/views/FedimintFederation_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Fedimint federation timestamp')} • Fedimint federation timestamp • Blockhead</title>
</svelte:head>


<Page>
	<FedimintFederation_TimestampView
		selection={pageSelection}
	/>
</Page>
