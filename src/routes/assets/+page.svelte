<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	const hubKey = 'assets'


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import CoinsView from '$/views/CoinsView.svelte'
	import CurrenciesView from '$/views/CurrenciesView.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
	import LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'
</script>


<Page>
	<GlobalView
		selector={{ scope: 'Assets' }}
		title="Assets"
		href={resolve('/assets')}
		open
	>
		{#snippet children({ open: hubOpen,
		})}
			<CollapsibleTabs
				id={`${hubKey}:hub`}
				sectionIdPrefix={hubKey}
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
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Assets
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCoins({ id, label })}
					<CoinsView
						href={resolve('/coins')}
						entityFieldReference={{
							entityType: EntityType._Global,
							selector: { scope: '$$coins' },
							fieldName: '$$coins',
						}}
						id="coins"
						limit={120}
						open={hubOpen}
					/>
				{/snippet}

				{#snippet SectionCurrencies({ id, label })}
					<CurrenciesView
						href={resolve('/currencies')}
						entityFieldReference={{
							entityType: EntityType._Global,
							selector: { scope: '$$currencies' },
							fieldName: '$$currencies',
						}}
						open={hubOpen}
					/>
				{/snippet}

				{#snippet SectionPools({ id, label })}
					<LiquidityPoolsView
						href={resolve('/pools')}
						entityFieldReference={{
							entityType: EntityType._Global,
							selector: { scope: '$$liquidityPools' },
							fieldName: '$$liquidityPools',
						}}
						id="pools"
						open={hubOpen}
					/>
				{/snippet}
		</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
