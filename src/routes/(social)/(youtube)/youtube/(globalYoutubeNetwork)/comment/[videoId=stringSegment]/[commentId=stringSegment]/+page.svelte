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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.YoutubeComment, data.selector, {
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
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.text) ?? '')].filter(Boolean).join(' ') || 'YouTube comment' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).text) ?? '')].filter(Boolean).join(' ') || 'YouTube comment')))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeCommentView from '$/views/YoutubeCommentView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • YouTube comment • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeCommentView
		href={
			resolve('/youtube/comment/[videoId=stringSegment]/[commentId=stringSegment]', {
				videoId: params.videoId,
				commentId: params.commentId,
			})
		}
		selection={pageSelection}
	/>
</Page>
