<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
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
	{@const collectionSelection = select(EntityType.FarcasterChannel, {
		id: params.channelId,
	})
		.$$casts({
			sources: [
				Source.Farcaster_Rest,
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
		})}

	<FarcasterCastsView
		href={
			resolve(
				'/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/casts',
				{
					channelId: String(params.channelId),
				}
			)
		}
		title='Farcaster channel casts'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='casts'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
