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

	const pageSelection = $derived(select(EntityType.NostrRelay_Timestamp, {
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
			name: true,
			reachable: true,
			software: true,
			version: true,
			supportedNips: true,
			isPaid: true,
			activeUsers: true,
			eventsPerDay: true,
			rank: true,
			paymentsUrl: true,
			termsOfServiceUrl: true,
			iconUrl: true,
			bannerUrl: true,
			pubkey: true,
			contact: true,
			error: true,
			description: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.name) ?? ''), String((pageSelection.entitySelector.source) ?? '')].filter(Boolean).join(' ') || 'Nostr relay timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).source) ?? '')].filter(Boolean).join(' ') || 'Nostr relay timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRelay_TimestampView from '$/views/NostrRelay_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Nostr relay timestamp • Blockhead</title>
</svelte:head>


<Page>
	<NostrRelay_TimestampView
		href={
			resolve('/nostr/relay/[relayKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				relayKey: params.relayKey,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
