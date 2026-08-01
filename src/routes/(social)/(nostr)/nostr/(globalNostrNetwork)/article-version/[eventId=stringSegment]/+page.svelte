<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NostrArticleEvent, {
		eventId: params.eventId,
	}, {
		fields: {
			title: true,
			identifier: true,
			createdAt: true,
			$article: true,
			$author: true,
			publishedAt: true,
			signature: true,
			content: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticleEventView from '$/views/NostrArticleEventView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.eventId ?? '') || 'Nostr article event' : [(pageSelection.entity.title ?? ''), pageSelection.entity.identifier].filter(Boolean).join(' ') || pageSelection.entitySelector.eventId || 'Nostr article event'} • Nostr article event • Blockhead</title>
</svelte:head>


<Page>
	<NostrArticleEventView
		selection={pageSelection}
	/>
</Page>
