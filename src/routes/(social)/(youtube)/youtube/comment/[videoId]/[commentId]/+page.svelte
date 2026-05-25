<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	const entityId = $derived({
		videoId: decodeURIComponent(params.videoId),
		commentId: decodeURIComponent(params.commentId),
	})


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeCommentView from '$/views/YouTubeCommentView.svelte'
</script>


<Page>
	<YouTubeCommentView
		{entityId}
	/>
</Page>
