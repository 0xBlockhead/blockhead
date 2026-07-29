<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.AlgorandAccount> = $props()

	const viewDomId = $derived('algorand-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
	import AlgorandAccount_TimestampsView from '$/views/AlgorandAccount_TimestampsView.svelte'
	import AlgorandAssetHolding_RoundsView from '$/views/AlgorandAssetHolding_RoundsView.svelte'
	import AlgorandApplicationLocalState_RoundsView from '$/views/AlgorandApplicationLocalState_RoundsView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'algorand account'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		algorand account
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
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
				<AlgorandAccount_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand account observations.'
					id={`${id}-list`}
				/>
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
				<AlgorandAssetHolding_RoundsView
					selection={selection.$$assetHoldingRounds}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand asset holding rounds.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAlgorandAccountAppLocalState({ id, label, open })}
				<AlgorandApplicationLocalState_RoundsView
					selection={selection.$$applicationLocalStateRounds}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand application local state rounds.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
