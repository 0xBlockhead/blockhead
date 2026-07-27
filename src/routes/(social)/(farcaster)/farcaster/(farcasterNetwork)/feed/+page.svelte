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
	import FarcasterFeedsView from '$/views/FarcasterFeedsView.svelte'
</script>


<svelte:head>
	<title>Farcaster feeds • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.FarcasterNetwork, {
		scope: 'FarcasterNetwork',
	})
		.$$feeds({
			sources: [
				Source.Constants_Internal,
			],
		})}

	<FarcasterFeedsView
		href={resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed')}
		title='Farcaster feeds'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='feeds'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
