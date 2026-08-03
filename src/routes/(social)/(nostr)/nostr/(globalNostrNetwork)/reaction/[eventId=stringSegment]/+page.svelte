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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NostrReaction, {
		eventId: params.eventId,
	}, {
		sources: [
			Source.NostrRelay_WebSocket,
			Source.Primal_Rest,
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
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.eventId ?? '') || 'Nostr reaction' : (pageSelection.entity.content ?? '') || pageSelection.entitySelector.eventId || 'Nostr reaction'} • Nostr reaction • Blockhead</title>
</svelte:head>


<Page>
	<NostrReactionView
		selection={pageSelection}
	/>
</Page>
