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
	import CoinsView from '$/views/CoinsView.svelte'
</script>


<svelte:head>
	<title>Coins • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$coins',
	})
		.$$coins({
			sources: [
				Source.Constants_Internal,
				Source.Coinpaprika_Rest,
			],
			limit: 8,
		})}

	<CoinsView
		href={resolve('/(assets)/coins')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='coins'
	/>
</Page>
