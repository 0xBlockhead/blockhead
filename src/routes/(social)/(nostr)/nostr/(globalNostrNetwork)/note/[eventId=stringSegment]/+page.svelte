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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NostrNote, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
		fields: {
			content: true,
			createdAt: true,
			kind: true,
			pubkey: true,
			$author: true,
			$replyToNote: true,
			$rootNote: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.content) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr note' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).content) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr note')))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Nostr note • Blockhead</title>
</svelte:head>


<Page>
	<NostrNoteView
		href={
			resolve('/nostr/note/[eventId=stringSegment]', {
				eventId: params.eventId,
			})
		}
		selection={pageSelection}
	/>
</Page>
