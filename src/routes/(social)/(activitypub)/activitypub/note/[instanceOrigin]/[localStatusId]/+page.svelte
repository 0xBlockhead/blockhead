<script lang="ts">
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
		{({
		instanceOrigin: decodeURIComponent(params.instanceOrigin),
		localStatusId: decodeURIComponent(params.localStatusId),
	})}
	>
	</ActivityPubNoteView>
</Page>
