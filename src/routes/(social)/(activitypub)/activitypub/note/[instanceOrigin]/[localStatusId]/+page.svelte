<script lang="ts">
	// State
	let {
		params,
	} = $props()


	const entityId = $derived({
		instanceOrigin: decodeURIComponent(params.instanceOrigin),
		localStatusId: decodeURIComponent(params.localStatusId),
	})


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<Page>
	<ActivityPubNoteView
		{entityId}
	>
	</ActivityPubNoteView>
</Page>
