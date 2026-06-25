<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<Page>
	<ActivityPubActorView
		selection={select(EntityType.ActivityPubActor, {
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
			localAccountId: decodeURIComponent(params.localAccountId),
		})}
	>
	</ActivityPubActorView>
</Page>
