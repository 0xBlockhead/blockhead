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

	const pageSelection = $derived(select(EntityType.MevBuilder_Timestamp, {
		$builder: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$builder: data.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			deliveredPayloadCount: true,
			deliveredValueWei: true,
			relayCount: true,
			windowStartSlot: true,
			windowEndSlot: true,
			sampleLimit: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MevBuilder_TimestampView from '$/views/MevBuilder_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'MEV builder timestamp' : [(String((({ ...{
		$builder: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).deliveredPayloadCount) ?? '') ? String((({ ...{
		$builder: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).deliveredPayloadCount) ?? '') + ' payloads' : ''), (String((({ ...{
		$builder: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).deliveredValueWei) ?? '') ? String((({ ...{
		$builder: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).deliveredValueWei) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'MEV builder timestamp'))} • MEV builder timestamp • Blockhead</title>
</svelte:head>


<Page>
	<MevBuilder_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				network: params.network,
				builderPubkey: params.builderPubkey,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
