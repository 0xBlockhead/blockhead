<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NostrProfile, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			$icon: true,
			displayName: true,
			about: true,
			nip05: true,
			website: true,
			metadataUpdatedAt: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.displayName) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).displayName) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile')))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Nostr profile • Blockhead</title>
</svelte:head>


<Page>
	<NostrProfileView
		href={
			resolve('/nostr/profile/[pubkey=stringSegment]', {
				pubkey: params.pubkey,
			})
		}
		selection={pageSelection}
	/>
</Page>
