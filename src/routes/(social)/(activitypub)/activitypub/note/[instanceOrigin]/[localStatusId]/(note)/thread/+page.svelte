<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()

	const entityId = $derived({
		instanceOrigin: decodeURIComponent(params.instanceOrigin),
		localStatusId: decodeURIComponent(params.localStatusId),
	})


	// Components
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<ActivityPubNotesView
		href={resolve('/activitypub/notes')}
		entityFieldReference={{
			entityType: EntityType.ActivityPubNote,
			entityId,
			fieldName: '$$thread',
		}}
		id="activitypub-note-thread"
		orderByCreatedAt="asc"
		placeholderText="Loading thread…"
		title="Thread"
	/>
</Page>
