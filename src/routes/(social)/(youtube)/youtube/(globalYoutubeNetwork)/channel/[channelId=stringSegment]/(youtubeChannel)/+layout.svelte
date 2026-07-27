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
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
</script>


{#key params.channelId}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]',
				{
					channelId: String(params.channelId),
				}
			)
		}
	>
		{#snippet Summary()}
			<YoutubeChannelView
				selection={
					select(EntityType.YoutubeChannel, data.selector, { sources: [
						Source.Youtube_Rest,
						Source.Piped_Rest,
						Source.Constants_Internal,
					] })
				}
				href={
					resolve(
						'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]',
						{
							channelId: String(params.channelId),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
