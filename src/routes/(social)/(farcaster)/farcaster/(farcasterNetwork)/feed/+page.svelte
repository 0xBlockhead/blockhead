<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


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
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='feeds'
	/>
</Page>
