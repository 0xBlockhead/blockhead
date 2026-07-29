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


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import YoutubeVideoView from '$/views/YoutubeVideoView.svelte'
</script>


{#key params.videoId}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]',
				{
					videoId: params.videoId,
				}
			)
		}
	>
		{#snippet Summary()}
			<YoutubeVideoView
				selection={
					select(EntityType.YoutubeVideo, data.selector, { sources: [
						Source.Youtube_Rest,
						Source.Piped_Rest,
						Source.Constants_Internal,
					] })
				}
				href={
					resolve(
						'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]',
						{
							videoId: params.videoId,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
