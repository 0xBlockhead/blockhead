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
				Source.Coinpaprika_OpenApi,
			],
			limit: 8,
		})}

	<CoinsView
		href={resolve('/(assets)/coins')}
		title='Coins'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='coins'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
