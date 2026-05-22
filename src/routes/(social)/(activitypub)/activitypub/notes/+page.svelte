<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubMastodonFieldNotes from '$/views/ActivityPubMastodonFieldNotes.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<ActivityPubMastodonFieldNotes
		entityFieldReference={{
			entityType: EntityType.ActivityPubNetwork,
			entityId: { scope: 'ActivityPubNetwork' },
			fieldName: '$$activityPubNotes',
		}}
		href={resolve('/activitypub/notes')}
		id="activitypub-notes"
		orderByCreatedAt="desc"
		placeholderText="Loading Mastodon public timeline…"
		title="Notes"
	/>
</Page>
