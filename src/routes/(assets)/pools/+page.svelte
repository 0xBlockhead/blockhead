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
	import LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'
</script>


<svelte:head>
	<title>Liquidity pools • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$liquidityPools',
	})
		.$$liquidityPools({
			sources: [
				Source.Dexscreener_OpenApi,
			],
			limit: 300,
		})}

	<LiquidityPoolsView
		href={resolve('/(assets)/pools')}
		title='Liquidity pools'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='liquidity-pools'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
