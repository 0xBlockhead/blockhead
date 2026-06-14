<script lang="ts">
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
		selector={{
			videoId: decodeURIComponent(params.videoId),
			commentId: decodeURIComponent(params.commentId),
		}}
	/>
</Page>
