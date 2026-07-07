<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeCommentView from '$/views/YoutubeCommentView.svelte'
</script>


<Page>
	<YoutubeCommentView
		href={
			resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
				videoId: params.videoId,
				commentId: params.commentId,
			})
		}
		selection={
			select(EntityType.YoutubeComment, {
				videoId: decodeURIComponent(params.videoId),
				commentId: decodeURIComponent(params.commentId),
			}, {
				sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				],
				fields: {
					text: true,
					publishedAtMs: true,
					authorDisplayName: true,
					$author: true,
					$video: true,
					$parentComment: true,
				},
			})
		}
	/>
</Page>
