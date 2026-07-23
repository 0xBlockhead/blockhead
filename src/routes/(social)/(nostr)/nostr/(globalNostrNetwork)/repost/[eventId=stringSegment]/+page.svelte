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

	const pageSelection = $derived(select(EntityType.NostrRepost, {
		eventId: params.eventId,
	}, {
		sources: [
			Source.Primal_Rest,
			Source.NostrBand_Rest,
		],
		fields: {
			repostedEventId: true,
			createdAt: true,
			kind: true,
			pubkey: true,
			$author: true,
			$repostedNote: true,
			$repostedArticle: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRepostView from '$/views/NostrRepostView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'Nostr repost' : [String((({ ...{
		eventId: params.eventId,
	}, ...pageSelection.entity }).repostedEventId) ?? '')].filter(Boolean).join(' ') || 'Nostr repost')} • Nostr repost • Blockhead</title>
</svelte:head>


<Page>
	<NostrRepostView
		href={
			resolve('/nostr/repost/[eventId=stringSegment]', {
				eventId: params.eventId,
			})
		}
		selection={pageSelection}
	/>
</Page>
