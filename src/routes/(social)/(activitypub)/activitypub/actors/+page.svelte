<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubActorsView from '$/views/ActivityPubActorsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<ActivityPubActorsView
		entityFieldReference={{
			entityType: EntityType.ActivityPubNetwork,
			entityId: { scope: 'ActivityPubNetwork' },
			fieldName: '$$activityPubActors',
		}}
		href={resolve('/activitypub/actors')}
		id="activitypub-actors"
	/>
</Page>
