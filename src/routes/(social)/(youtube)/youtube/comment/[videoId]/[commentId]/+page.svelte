<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeCommentView from '$/views/YoutubeCommentView.svelte'
</script>


<svelte:head>
	<title>YouTube comment • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeCommentView
		href={
			resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
				videoId: params.videoId,
				commentId: params.commentId,
			})
		}
		selection={
			select(EntityType.YoutubeComment, data.selector, {
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
