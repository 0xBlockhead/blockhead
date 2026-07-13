<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.MevRelay_Timestamp, {
		$relay: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
		$relay: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}).source],
		fields: {
			reachable: true,
			statusCode: true,
			error: true,
			deliveredPayloadSampleCount: true,
			builderSampleCount: true,
			sampleLimit: true,
			windowStartSlot: true,
			windowEndSlot: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.reachable) ?? ''), String((pageSelection.entitySelector.statusCode) ?? ''), String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'MEV relay timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).reachable) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).statusCode) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'MEV relay timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelay_TimestampView from '$/views/MevRelay_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • MEV relay timestamp • Blockhead</title>
</svelte:head>


<Page>
	<MevRelay_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				network: params.network,
				host: params.host,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
