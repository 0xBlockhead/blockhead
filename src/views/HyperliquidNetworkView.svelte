<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HyperliquidNetwork> = $props()

	const viewDomId = $derived('hyperliquid-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HyperliquidSpotAssetsView from '$/views/HyperliquidSpotAssetsView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'hyperliquid network'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		Hyperliquid
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-hyperliquid-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hyperliquid-chain-observations',
						label: 'Observations',
					},
					{
						id: 'hyperliquid-chain-blocks',
						label: 'Blocks',
					},
					{
						id: 'hyperliquid-chain-transactions',
						label: 'Transactions',
					},
				]
			}
			data-card
			class='network-view-collapsible-chain-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Chain activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHyperliquidChainObservations({ id, label, open })}
				<EntitiesList
					entityType={EntityType.HyperliquidNetwork_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid network observations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: hyperliquidNetworkTimestamp })}
						<EntityView
							entityType={EntityType.HyperliquidNetwork_Timestamp}
							entitySelector={hyperliquidNetworkTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionHyperliquidChainBlocks({ id, label, open })}
				<EntitiesList
					entityType={EntityType.HyperliquidBlock}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid blocks.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$blocks()}
				>
					{#snippet Item({ item: hyperliquidBlock })}
						<EntityView
							entityType={EntityType.HyperliquidBlock}
							entitySelector={hyperliquidBlock[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionHyperliquidChainTransactions({ id, label, open })}
				<EntitiesList
					entityType={EntityType.HyperliquidTransaction}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid transactions.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$transactions()}
				>
					{#snippet Item({ item: hyperliquidTransaction })}
						<EntityView
							entityType={EntityType.HyperliquidTransaction}
							entitySelector={hyperliquidTransaction[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-hyperliquid-validators'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hyperliquid-validator-list',
						label: 'Validators',
					},
				]
			}
			data-card
			class='network-view-collapsible-validators'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Validators</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHyperliquidValidatorList({ id, label, open })}
				<EntitiesList
					entityType={EntityType.HyperliquidValidator}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid validators.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$validators()}
				>
					{#snippet Item({ item: hyperliquidValidator })}
						<EntityView
							entityType={EntityType.HyperliquidValidator}
							entitySelector={hyperliquidValidator[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-hyperliquid-markets'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hyperliquid-spot-assets',
						label: 'Spot assets',
					},
					{
						id: 'hyperliquid-spot-pairs',
						label: 'Spot pairs',
					},
					{
						id: 'hyperliquid-perp-markets',
						label: 'Perp markets',
					},
					{
						id: 'hyperliquid-vaults',
						label: 'Vaults',
					},
				]
			}
			data-card
			class='network-view-collapsible-markets'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Markets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHyperliquidSpotAssets({ id, label, open })}
				<HyperliquidSpotAssetsView
					selection={selection.$$spotAssets}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid spot assets.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidSpotPairs({ id, label, open })}
				<EntitiesList
					entityType={EntityType.HyperliquidSpotPair}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid spot pairs.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$spotPairs()}
				>
					{#snippet Item({ item: hyperliquidSpotPair })}
						<EntityView
							entityType={EntityType.HyperliquidSpotPair}
							entitySelector={hyperliquidSpotPair[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionHyperliquidPerpMarkets({ id, label, open })}
				<EntitiesList
					entityType={EntityType.HyperliquidPerpMarket}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid perp markets.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$perpMarkets()}
				>
					{#snippet Item({ item: hyperliquidPerpMarket })}
						<EntityView
							entityType={EntityType.HyperliquidPerpMarket}
							entitySelector={hyperliquidPerpMarket[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionHyperliquidVaults({ id, label, open })}
				<EntitiesList
					entityType={EntityType.HyperliquidVault}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid vaults.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$vaults()}
				>
					{#snippet Item({ item: hyperliquidVault })}
						<EntityView
							entityType={EntityType.HyperliquidVault}
							entitySelector={hyperliquidVault[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
