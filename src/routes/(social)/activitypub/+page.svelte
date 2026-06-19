<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubView from '$/views/ActivityPubView.svelte'
</script>


<Page>
	<ActivityPubView
		selection={select(EntityType.ActivityPubNetwork, {
			scope: 'ActivityPubNetwork',
		})}
		open={false}
	/>
</Page>
