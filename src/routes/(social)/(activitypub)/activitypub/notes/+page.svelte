<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
</script>


<Page>
	<ActivityPubNotesView
		href={resolve('/(social)/(activitypub)/activitypub/notes')}
		entityFieldReference={{
			entityType: EntityType.ActivityPubNetwork,
			selector: { scope: 'ActivityPubNetwork' },
			fieldName: '$$activityPubNotes',
		}}
		id="activitypub-notes"
		orderByCreatedAt="desc"
		placeholderText="Loading Mastodon public timeline…"
		title="Notes"
	/>
</Page>
