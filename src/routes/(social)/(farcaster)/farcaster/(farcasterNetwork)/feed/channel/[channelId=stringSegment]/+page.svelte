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
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<svelte:head>
	<title>Farcaster channel feed • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastsView
		href={
			resolve('/farcaster/feed/channel/[channelId=stringSegment]', {
				channelId: params.channelId,
			})
		}
		title='Farcaster channel feed'
		selection={
			select(EntityType.FarcasterFeed, {
				variant: 'byChannel',
				channelId: params.channelId,
			}).$$entries({
				sources: [
					Source.Neynar_Rest,
					Source.Farcaster_Rest,
					Source.Snapchain_Rest,
				],
				count: true,
			})
		}
		id='entries'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
