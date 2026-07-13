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
	<title>Farcaster channel casts • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastsView
		href={
			resolve('/farcaster/channel/[channelId=stringSegment]/casts', {
				channelId: params.channelId,
			})
		}
		title='Farcaster channel casts'
		selection={
			select(EntityType.FarcasterChannel, {
				id: decodeURIComponent(params.channelId),
			}).$$casts({
				sources: [
					Source.Farcaster_Rest,
					Source.Neynar_Rest,
					Source.Snapchain_Rest,
				],
			})
		}
		id='casts'
	/>
</Page>
