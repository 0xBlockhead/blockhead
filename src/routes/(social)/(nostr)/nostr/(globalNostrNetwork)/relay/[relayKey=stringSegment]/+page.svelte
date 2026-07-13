<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NostrRelay, {
		relayUrl: params.relayKey,
	}, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			description: true,
			software: true,
			version: true,
			supportedNipCount: true,
			isPaid: true,
			limit: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.name) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.relayUrl) ?? '')].filter(Boolean).join(' ') || 'Nostr relay' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).relayUrl) ?? '')].filter(Boolean).join(' ') || 'Nostr relay'))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRelayView from '$/views/NostrRelayView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Nostr relay • Blockhead</title>
</svelte:head>


<Page>
	<NostrRelayView
		href={
			resolve('/nostr/relay/[relayKey=stringSegment]', {
				relayKey: params.relayKey,
			})
		}
		selection={pageSelection}
	/>
</Page>
