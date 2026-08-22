<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NostrNote, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
			Source.Primal_Rest,
		],
		fields: {
			content: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.eventId ?? '') || 'Nostr note' : (pageSelection.entity.content ?? '') || pageSelection.entitySelector.eventId || 'Nostr note')} • Nostr note • Blockhead</title>
</svelte:head>


<Page>
	<NostrNoteView
		selection={pageSelection}
	/>
</Page>
