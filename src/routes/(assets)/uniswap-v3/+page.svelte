<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import HeadingComponent from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import UniswapV3PoolsView from '$/views/UniswapV3PoolsView.svelte'
</script>


<svelte:head>
	<title>Uniswap V3 • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$uniswapV3Pools',
	})
		.$$uniswapV3Pools({
			sources: [
				Source.Voltaire_JsonRpc,
				Source.UniswapContracts_Evm,
			],
			limit: 64,
		})}

	<header data-column="gap-2">
		<h1>Uniswap V3</h1>
		<p data-text="muted">
			Concentrated-liquidity pools and NFT positions. Pool cards resolve factory, token legs, fee tier, and head-block slot0 state via Voltaire JSON-RPC.
		</p>
	</header>

	<section data-column="gap-4">
		<header data-row="wrap gap-4" data-row-item="flexible">
			<HeadingComponent>
				<a href={resolve('/(assets)/uniswap-v3/pools')}>Pools</a>
			</HeadingComponent>
		</header>

		<UniswapV3PoolsView
			href={resolve('/(assets)/uniswap-v3/pools')}
			selection={collectionSelection}
			countResource={collectionSelection.count}
			title="Pools"
			emptyText="No Uniswap V3 pools in catalog."
			id="uniswap-v3-hub-pools"
			collapsible={false}
		/>
	</section>
</Page>
