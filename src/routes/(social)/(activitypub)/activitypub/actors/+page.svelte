<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(
			EntityType.ActivityPubNetwork,
			{ scope: 'ActivityPubNetwork' }
		).$$activityPubActors}
		id="activitypub-actors"
	/>
</Page>
