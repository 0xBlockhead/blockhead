<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannelsView from '$/views/FarcasterChannelsView.svelte'
</script>


<svelte:head>
	<title>Farcaster channels • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.FarcasterNetwork, {
		scope: 'FarcasterNetwork',
	})
		.$$channels({
			sources: [
				Source.Farcaster_Rest,
			],
		})}

	<FarcasterChannelsView
		href={resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/channels')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='channels'
	/>
</Page>
