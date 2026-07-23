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

	const pageSelection = $derived(select(EntityType.NostrRelay, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRelayView from '$/views/NostrRelayView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.relayUrl) ?? '')].filter(Boolean).join(' ') || 'Nostr relay' : [String((({ ...data.selector, ...pageSelection.entity }).relayUrl) ?? '')].filter(Boolean).join(' ') || 'Nostr relay'))} • Nostr relay • Blockhead</title>
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
