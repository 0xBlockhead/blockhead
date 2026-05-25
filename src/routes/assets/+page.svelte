<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
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
		entityId={{}}
		title="Assets"
		href={resolve('/assets')}
		open
	>
		{#snippet children({ open: hubOpen,
		})}
			<CollapsibleTabs
				id={`${hubKey}:hub`}
				{...{ 'data-card': '' }}
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

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Coins"
						href={`#${hubKey}:coins`}
					>Coins</a>
					<a
						data-scroll-marker-label="Currencies"
						href={`#${hubKey}:currencies`}
					>Currencies</a>
					<a
						data-scroll-marker-label="Pools"
						href={`#${hubKey}:pools`}
					>Pools</a>
				{/snippet}

				{#snippet body({ open: _paneOpen })}
					<section
						id={`${hubKey}:coins`}
						data-scroll-marker-label="Coins"
					>
						<CoinsView
							href={resolve('/coins')}
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$coins',
							}}
							id="coins"
							limit={120}
							open={hubOpen}
						/>
					</section>

					<section
						id={`${hubKey}:currencies`}
						data-scroll-marker-label="Currencies"
					>
						<CurrenciesView
							href={resolve('/currencies')}
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$currencies',
							}}
							open={hubOpen}
						/>
					</section>

					<section
						id={`${hubKey}:pools`}
						data-scroll-marker-label="Pools"
					>
						<LiquidityPoolsView
							href={resolve('/pools')}
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$liquidityPools',
							}}
							id="pools"
							open={hubOpen}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
