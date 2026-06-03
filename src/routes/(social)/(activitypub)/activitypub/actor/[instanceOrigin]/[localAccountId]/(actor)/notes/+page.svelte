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
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<ActivityPubNotesView
		href={resolve('/activitypub/notes')}
		entityFieldReference={{
			entityType: EntityType.ActivityPubActor,
			({
		instanceOrigin: decodeURIComponent(params.instanceOrigin),
		localAccountId: decodeURIComponent(params.localAccountId),
	}),
			fieldName: '$$notes',
		}}
		id="activitypub-actor-notes"
		orderByCreatedAt="desc"
		placeholderText="Loading statuses…"
		title="Statuses"
	/>
</Page>
