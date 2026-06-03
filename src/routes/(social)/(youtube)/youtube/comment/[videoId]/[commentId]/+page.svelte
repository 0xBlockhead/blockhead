<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeCommentView from '$/views/YouTubeCommentView.svelte'
</script>


<Page>
	<YouTubeCommentView
		{({
		videoId: decodeURIComponent(params.videoId),
		commentId: decodeURIComponent(params.commentId),
	})}
	/>
</Page>
