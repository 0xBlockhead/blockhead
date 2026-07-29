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
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


{#key params.channelId}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]',
				{
					channelId: params.channelId,
				}
			)
		}
	>
		{#snippet Summary()}
			<FarcasterChannelView
				selection={
					select(EntityType.FarcasterChannel, data.selector, { sources: [
						Source.Farcaster_Rest,
					] })
				}
				href={
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]',
						{
							channelId: params.channelId,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
