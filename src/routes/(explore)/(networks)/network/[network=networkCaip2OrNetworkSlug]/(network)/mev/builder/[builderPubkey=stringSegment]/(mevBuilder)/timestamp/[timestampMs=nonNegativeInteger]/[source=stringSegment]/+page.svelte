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
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [(String((pageSelection.entitySelector.deliveredPayloadCount) ?? '') ? String((pageSelection.entitySelector.deliveredPayloadCount) ?? '') + ' payloads' : ''), (String((pageSelection.entitySelector.deliveredValueWei) ?? '') ? String((pageSelection.entitySelector.deliveredValueWei) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'MEV builder timestamp' : [(String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).deliveredPayloadCount) ?? '') ? String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).deliveredPayloadCount) ?? '') + ' payloads' : ''), (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).deliveredValueWei) ?? '') ? String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).deliveredValueWei) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'MEV builder timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import MevBuilder_TimestampView from '$/views/MevBuilder_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • MEV builder timestamp • Blockhead</title>
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
