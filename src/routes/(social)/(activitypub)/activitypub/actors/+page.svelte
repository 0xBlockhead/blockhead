<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubActorsView from '$/views/ActivityPubActorsView.svelte'
</script>


<Page>
	<ActivityPubActorsView
		href={resolve('/activitypub/actors')}
		entityFieldReference={{
			entityType: EntityType.ActivityPubNetwork,
			selector: { scope: 'ActivityPubNetwork' },
			fieldName: '$$activityPubActors',
		}}
		id="activitypub-actors"
	/>
</Page>
