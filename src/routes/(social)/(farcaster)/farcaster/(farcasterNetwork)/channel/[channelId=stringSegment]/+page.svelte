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

	const pageSelection = $derived(select(EntityType.FarcasterChannel, data.selector, {
		sources: [
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
			Source.Snapchain_Rest,
		],
		fields: {
			$icon: true,
			name: true,
			createdAt: true,
			url: true,
			$lead: true,
			$moderator: true,
			externalLinkUrl: true,
			description: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.id) ?? '')].filter(Boolean).join(' ') || 'Farcaster channel' : [String((({ ...data.selector, ...pageSelection.entity }).name) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'Farcaster channel'))} • Farcaster channel • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterChannelView
		href={
			resolve('/farcaster/channel/[channelId=stringSegment]', {
				channelId: params.channelId,
			})
		}
		selection={pageSelection}
	/>
</Page>
