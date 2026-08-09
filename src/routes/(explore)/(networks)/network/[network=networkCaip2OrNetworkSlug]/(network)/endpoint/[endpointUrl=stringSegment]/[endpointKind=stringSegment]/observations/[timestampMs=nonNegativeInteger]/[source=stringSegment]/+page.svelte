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

	const pageSelection = $derived(select(EntityType.NetworkEndpointObservation_Timestamp, {
		$network: data.selector,
		endpointUrl: params.endpointUrl,
		endpointKind: params.endpointKind,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkEndpointObservation_TimestampView from '$/views/NetworkEndpointObservation_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'network endpoint observation timestamp')} • network endpoint observation timestamp • Blockhead</title>
</svelte:head>


<Page>
	<NetworkEndpointObservation_TimestampView
		selection={pageSelection}
	/>
</Page>
