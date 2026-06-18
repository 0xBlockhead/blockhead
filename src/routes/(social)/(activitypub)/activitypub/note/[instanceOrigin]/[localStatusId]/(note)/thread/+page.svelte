<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
</script>


<Page>
	<ActivityPubNotesView
		href={resolve('/activitypub/notes')}
		selection={select(
			EntityType.ActivityPubNote,
			{
				instanceOrigin: decodeURIComponent(params.instanceOrigin),
				localStatusId: decodeURIComponent(params.localStatusId),
			}
		).$$thread}
		id="activitypub-note-thread"
		orderByCreatedAt="asc"
		placeholderText="Loading thread…"
		title="Thread"
	/>
</Page>
