<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AlgorandAccount>, 'prefetched'> = $props()

	const viewDomId = $derived('algorand-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/account/[address=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					address: selection.entitySelector.address,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
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

	{#snippet Details()}
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

			{#snippet SectionAlgorandAccountTimestamps({ id, label })}
				<AlgorandAccount_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
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

			{#snippet SectionAlgorandAccountAssetHoldings({ id, label })}
				<AlgorandAssetHolding_RoundsView
					selection={selection.$$assetHoldingRounds}
					collapsible={false}
					title={label}
					emptyText='No Algorand asset holding rounds.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAlgorandAccountAppLocalState({ id, label })}
				<AlgorandApplicationLocalState_RoundsView
					selection={selection.$$applicationLocalStateRounds}
					collapsible={false}
					title={label}
					emptyText='No Algorand application local state rounds.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
