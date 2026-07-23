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

	const pageSelection = $derived(select(EntityType.NostrReaction, {
		eventId: params.eventId,
	}, {
		sources: [
			Source.Primal_Rest,
			Source.NostrBand_Rest,
		],
		fields: {
			content: true,
			createdAt: true,
			kind: true,
			pubkey: true,
			$author: true,
			$targetNote: true,
			$targetArticle: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrReactionView from '$/views/NostrReactionView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
		eventId: params.eventId,
	}.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr reaction' : [String((({ ...{
		eventId: params.eventId,
	}, ...pageSelection.entity }).content) ?? '')].filter(Boolean).join(' ') || [String((({ ...{
		eventId: params.eventId,
	}, ...pageSelection.entity }).eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr reaction')} • Nostr reaction • Blockhead</title>
</svelte:head>


<Page>
	<NostrReactionView
		href={
			resolve('/nostr/reaction/[eventId=stringSegment]', {
				eventId: params.eventId,
			})
		}
		selection={pageSelection}
	/>
</Page>
