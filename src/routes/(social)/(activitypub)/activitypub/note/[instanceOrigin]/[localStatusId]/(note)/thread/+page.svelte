<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType.ActivityPubNote,
			selector: {
				instanceOrigin: decodeURIComponent(params.instanceOrigin),
				localStatusId: decodeURIComponent(params.localStatusId),
			},
			fieldName: '$$thread',
		}}
		id="activitypub-note-thread"
		orderByCreatedAt="asc"
		placeholderText="Loading thread…"
		title="Thread"
	/>
</Page>
