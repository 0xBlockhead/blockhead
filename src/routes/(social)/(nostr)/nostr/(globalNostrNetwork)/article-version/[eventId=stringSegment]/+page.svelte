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
	<title>{(pageSelection.entity == null ? [String(({
		eventId: params.eventId,
	}.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr article event' : [String((({ ...{
		eventId: params.eventId,
	}, ...pageSelection.entity }).title) ?? ''), String((({ ...{
		eventId: params.eventId,
	}, ...pageSelection.entity }).identifier) ?? '')].filter(Boolean).join(' ') || [String((({ ...{
		eventId: params.eventId,
	}, ...pageSelection.entity }).eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr article event')} • Nostr article event • Blockhead</title>
</svelte:head>


<Page>
	<NostrArticleEventView
		href={
			resolve('/nostr/article-version/[eventId=stringSegment]', {
				eventId: params.eventId,
			})
		}
		selection={pageSelection}
	/>
</Page>
