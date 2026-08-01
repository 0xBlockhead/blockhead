<!-- Generated from APP.ts. Do not edit by hand. -->

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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AlgorandAccount> = $props()

	const viewDomId = $derived('algorand-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-algorand-account-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'algorand-account-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAlgorandAccountTimestamps({ id, label, open })}
				<EntitiesList
					entityType={EntityType.AlgorandAccount_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No Algorand account observations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: algorandAccountTimestamp })}
						<EntityView
							entityType={EntityType.AlgorandAccount_Timestamp}
							entitySelector={algorandAccountTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-algorand-account-holdings'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'algorand-account-asset-holdings',
						label: 'Asset holdings',
					},
					{
						id: 'algorand-account-app-local-state',
						label: 'Application local state',
					},
				]
			}
			data-card
			class='network-view-collapsible-holdings'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Holdings and apps</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAlgorandAccountAssetHoldings({ id, label, open })}
				<EntitiesList
					entityType={EntityType.AlgorandAssetHolding_Round}
					collapsible={false}
					title={label}
					emptyText='No Algorand asset holding rounds.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$assetHoldingRounds()}
				>
					{#snippet Item({ item: algorandAssetHoldingRound })}
						<EntityView
							entityType={EntityType.AlgorandAssetHolding_Round}
							entitySelector={algorandAssetHoldingRound[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionAlgorandAccountAppLocalState({ id, label, open })}
				<EntitiesList
					entityType={EntityType.AlgorandApplicationLocalState_Round}
					collapsible={false}
					title={label}
					emptyText='No Algorand application local state rounds.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$applicationLocalStateRounds()}
				>
					{#snippet Item({ item: algorandApplicationLocalStateRound })}
						<EntityView
							entityType={EntityType.AlgorandApplicationLocalState_Round}
							entitySelector={algorandApplicationLocalStateRound[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
