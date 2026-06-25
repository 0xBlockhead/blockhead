<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
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
		href={resolve('/(social)/(activitypub)/notes')}
		selection={select(
			EntityType.ActivityPubNetwork,
			{ scope: 'ActivityPubNetwork' }
		).$$activityPubNotes}
		id="activitypub-notes"
		orderByCreatedAt="desc"
		placeholderText="Loading Mastodon public timeline…"
		title="Notes"
	/>
</Page>
