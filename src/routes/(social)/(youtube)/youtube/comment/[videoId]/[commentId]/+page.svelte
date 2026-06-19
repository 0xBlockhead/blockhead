<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(EntityType.YouTubeComment, {
			videoId: decodeURIComponent(params.videoId),
			commentId: decodeURIComponent(params.commentId),
		})}
	/>
</Page>
