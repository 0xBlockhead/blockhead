<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import CoinsView from '$/views/CoinsView.svelte'
	import CurrenciesView from '$/views/CurrenciesView.svelte'
	import LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Assets • Blockhead</title>
</svelte:head>


<Page>
	<CollapsibleTabs
		id='assets:hub'
		sectionIdPrefix='assets'
		sections={[
			{ id: 'coins', label: 'Coins' },
			{ id: 'currencies', label: 'Currencies' },
			{ id: 'pools', label: 'Pools' },
		]}
		data-card
		scrollContainerProps={{
			'data-row': 'start align-start',
			style: '--carousel-basis: 40ch',
		}}
	>
		{#snippet Summary({ open: _open })}
			<header
				data-row-item='flexible'
				data-row='wrap gap-4'
			>
				<HeadingComponent>Assets</HeadingComponent>
			</header>
		{/snippet}

		{#snippet SectionCoins()}
			<CoinsView
				href={resolve('/(assets)/coins')}
				selection={select(EntityType._Global, { scope: '$$coins' })[EntityProxyField]<EntityType.Coin>('$$coins')}
				id='coins'
				open={true}
			/>
		{/snippet}

		{#snippet SectionCurrencies()}
			<CurrenciesView
				href={resolve('/(assets)/(currencies)/currencies')}
				selection={select(EntityType._Global, { scope: '$$currencies' })[EntityProxyField]<EntityType.Currency>('$$currencies')}
				open={true}
			/>
		{/snippet}

		{#snippet SectionPools()}
			<LiquidityPoolsView
				href={resolve('/(assets)/pools')}
				selection={select(EntityType._Global, { scope: '$$liquidityPools' })[EntityProxyField]<EntityType.LiquidityPool>('$$liquidityPools')}
				id='pools'
				open={false}
			/>
		{/snippet}
	</CollapsibleTabs>
</Page>
