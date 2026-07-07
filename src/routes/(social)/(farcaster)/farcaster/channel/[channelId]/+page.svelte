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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<Page>
	<FarcasterChannelView
		href={
			resolve('/(social)/(farcaster)/farcaster/channel/[channelId]', {
				channelId: params.channelId,
			})
		}
		selection={
			select(EntityType.FarcasterChannel, {
				id: decodeURIComponent(params.channelId),
			}, {
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
			})
		}
	/>
</Page>
