<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const channelId = $derived(
		page.params.channelId ?? '',
	)


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(youtube)/youtube/channel/[channelId]', {
		channelId: encodeURIComponent(channelId),
	})}
	id={channelId}
>
	{#snippet Summary({ open: _open })}
		<YouTubeChannelView
			selection={
				select(
					EntityType.YouTubeChannel,
					{
						channelId: decodeURIComponent(channelId),
					}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
