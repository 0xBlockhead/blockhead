<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { htmlToPlainText } from '$/lib/html.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ActivityPubNote, {
		activityStreamsUri: params.activityStreamsUri,
	}, {
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			content: true,
			localStatusId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'ActivityPub note' : [pageSelection.entity.content == null ? '' : htmlToPlainText(pageSelection.entity.content), pageSelection.entity.localStatusId].filter(Boolean).join(' ') || 'ActivityPub note'} • ActivityPub note • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubNoteView
		selection={pageSelection}
	/>
</Page>
