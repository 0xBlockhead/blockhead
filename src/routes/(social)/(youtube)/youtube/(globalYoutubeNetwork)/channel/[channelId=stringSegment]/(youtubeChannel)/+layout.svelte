<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			resolve('/youtube/channel/[channelId=stringSegment]', {
				channelId: params.channelId,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = YoutubeChannelView}

			<DetailView
				selection={select(EntityType.YoutubeChannel, data.selector)}
				href={
					resolve('/youtube/channel/[channelId=stringSegment]', {
						channelId: params.channelId,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
