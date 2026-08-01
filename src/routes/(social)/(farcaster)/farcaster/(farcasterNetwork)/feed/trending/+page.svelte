<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<svelte:head>
	<title>Farcaster trending casts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.FarcasterFeed, {
		variant: 'trending',
	})
		.$$entries({
			sources: [
				Source.Neynar_Rest,
			],
		})}

	<FarcasterCastsView
		href={resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/trending')}
		title='Farcaster trending casts'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='entries'
	/>
</Page>
