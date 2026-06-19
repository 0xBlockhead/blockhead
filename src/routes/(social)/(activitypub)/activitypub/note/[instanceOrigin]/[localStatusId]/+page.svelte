<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<Page>
	<ActivityPubNoteView
		selection={select(EntityType.ActivityPubNote, {
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
			localStatusId: decodeURIComponent(params.localStatusId),
		})}
	>
	</ActivityPubNoteView>
</Page>
