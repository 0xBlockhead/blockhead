<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	const entityId = $derived({
		instanceOrigin: decodeURIComponent(params.instanceOrigin),
		localStatusId: decodeURIComponent(params.localStatusId),
	})


	// Components
	import ActivityPubMastodonFieldNotes from '$/views/ActivityPubMastodonFieldNotes.svelte'
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<ActivityPubMastodonFieldNotes
		entityFieldReference={{
			entityType: EntityType.ActivityPubNote,
			entityId,
			fieldName: '$$thread',
		}}
		href={resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/(note)/thread', {
			instanceOrigin: encodeURIComponent(entityId.instanceOrigin),
			localStatusId: encodeURIComponent(entityId.localStatusId),
		})}
		id="activitypub-note-thread"
		orderByCreatedAt="asc"
		placeholderText="Loading thread…"
		title="Thread"
	/>
</Page>
