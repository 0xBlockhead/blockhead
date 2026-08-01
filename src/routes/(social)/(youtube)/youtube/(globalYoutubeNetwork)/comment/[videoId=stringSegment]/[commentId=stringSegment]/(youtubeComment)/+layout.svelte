<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


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


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import YoutubeCommentView from '$/views/YoutubeCommentView.svelte'
</script>


{#key [params.videoId, params.commentId].join(':')}
	<ParentPageCollapsible
		href={detailHref}
	>
		{#snippet Summary()}
			<YoutubeCommentView
				selection={
					select(EntityType.YoutubeComment, data.selector, {
						sources: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
					})
				}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
