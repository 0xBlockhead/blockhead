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


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelay_TimestampView from '$/views/MevRelay_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String(({
		$relay: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}.timestampMs) ?? '')].filter(Boolean).join(' ') || 'MEV relay timestamp' : [String((({ ...{
		$relay: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).reachable) ?? ''), String((({ ...{
		$relay: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).statusCode) ?? ''), String((({ ...{
		$relay: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'MEV relay timestamp'))} • MEV relay timestamp • Blockhead</title>
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
