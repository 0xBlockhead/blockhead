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


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NostrNote, data.selector, {
				sources: [
					Source.Constants_Internal,
					Source.NostrRelay_WebSocket,
					Source.Primal_Rest,
				],
				fields: {
					content: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.eventId ?? '') || 'Nostr note' : (pageSelection.entity.content ?? '') || pageSelection.entitySelector.eventId || 'Nostr note')} • Nostr note • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Nostr note'} • Nostr note • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NostrNote, data.selector, {
				sources: [
					Source.Constants_Internal,
					Source.NostrRelay_WebSocket,
					Source.Primal_Rest,
				],
				fields: {
					content: true,
				},
			})}

	<NostrNoteView
		selection={pageSelection}
	/>
	{/if}
</Page>
