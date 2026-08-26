<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]',
			{
				videoId: params.videoId,
				commentId: params.commentId,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.YoutubeComment, data.selector, {
		sources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import YoutubeCommentView from '$/views/YoutubeCommentView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<YoutubeCommentView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
