<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { htmlToPlainText } from '$/lib/html.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ActivityPubNote, data.selector, {
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			content: true,
			createdAt: true,
			$author: true,
			statusUrl: true,
			activityStreamsUri: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.localStatusId ?? '') || 'ActivityPub note' : [pageSelection.entity.content == null ? '' : htmlToPlainText(pageSelection.entity.content), pageSelection.entitySelector.localStatusId].filter(Boolean).join(' ') || 'ActivityPub note')} • ActivityPub note • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubNoteView
		selection={pageSelection}
	/>
</Page>
