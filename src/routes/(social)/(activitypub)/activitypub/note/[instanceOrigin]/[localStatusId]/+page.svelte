<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

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
		href={resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
			instanceOrigin: encodeURIComponent(entityId.instanceOrigin),
			localStatusId: encodeURIComponent(entityId.localStatusId),
		})}
	>
	</ActivityPubNoteView>
</Page>
