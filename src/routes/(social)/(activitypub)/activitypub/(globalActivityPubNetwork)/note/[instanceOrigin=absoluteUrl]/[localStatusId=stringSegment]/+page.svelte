<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { htmlToPlainText } from '$/lib/html.ts'
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
			activityStreamsUri: true,
			content: true,
			createdAt: true,
			$author: true,
			statusUrl: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.localStatusId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub note' : [({ ...data.selector, ...pageSelection.entity }).content == null ? '' : String((htmlToPlainText((({ ...data.selector, ...pageSelection.entity }).content))) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).localStatusId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub note'))} • ActivityPub note • Blockhead</title>
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
