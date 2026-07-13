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

	const pageSelection = $derived(select(EntityType.ActivityPubNote, data.selector, {
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			content: true,
			createdAt: true,
			$author: true,
			statusUrl: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.content) ?? ''), String((pageSelection.entitySelector.localStatusId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub note' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).content) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).localStatusId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub note')))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • ActivityPub note • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubNoteView
		href={
			resolve('/activitypub/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]', {
				instanceOrigin: params.instanceOrigin,
				localStatusId: params.localStatusId,
			})
		}
		selection={pageSelection}
	/>
</Page>
