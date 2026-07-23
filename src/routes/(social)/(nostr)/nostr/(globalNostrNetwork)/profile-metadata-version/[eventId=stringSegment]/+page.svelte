<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NostrProfileMetadataEvent, {
		eventId: params.eventId,
	}, {
		fields: {
			$icon: true,
			displayName: true,
			nip05: true,
			pubkey: true,
			createdAt: true,
			$profile: true,
			website: true,
			lud16: true,
			signature: true,
			about: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfileMetadataEventView from '$/views/NostrProfileMetadataEventView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'Nostr profile metadata event' : [String((({ ...{
		eventId: params.eventId,
	}, ...pageSelection.entity }).displayName) ?? ''), String((({ ...{
		eventId: params.eventId,
	}, ...pageSelection.entity }).nip05) ?? '')].filter(Boolean).join(' ') || [String((({ ...{
		eventId: params.eventId,
	}, ...pageSelection.entity }).pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile metadata event')} • Nostr profile metadata event • Blockhead</title>
</svelte:head>


<Page>
	<NostrProfileMetadataEventView
		href={
			resolve('/nostr/profile-metadata-version/[eventId=stringSegment]', {
				eventId: params.eventId,
			})
		}
		selection={pageSelection}
	/>
</Page>
