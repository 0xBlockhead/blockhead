<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import { getAppClient } from '$/routes/applicationClient.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import CoinsView from '$/views/CoinsView.svelte'
	import CurrenciesView from '$/views/CurrenciesView.svelte'
	import LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'
	import { resolve } from '$app/paths'


	// Context
	const select = getAppClient().select


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
									href={resolve('/coins')}
						selection={select(EntityType._Global, { scope: '$$coins' }).$$coins}
						id='coins'
						open={true}
						data-column-item='flexible'
						data-card
						data-scroll-container
					/>
		{/snippet}

		{#snippet SectionCurrencies()}
					<CurrenciesView
												href={resolve('/currencies')}
						selection={select(EntityType._Global, { scope: '$$currencies' }).$$currencies}
						open={true}
						data-column-item='flexible'
						data-card
						data-scroll-container
					/>
		{/snippet}

		{#snippet SectionPools()}
					<LiquidityPoolsView
												href={resolve('/pools')}
				selection={select(EntityType._Global, { scope: '$$liquidityPools' }).$$liquidityPools}
						id='pools'
						open={true}
						data-column-item='flexible'
						data-card
						data-scroll-container
					/>
		{/snippet}
	</CollapsibleTabs>
</Page>
