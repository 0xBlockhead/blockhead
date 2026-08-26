<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.DydxChainNetwork>, 'prefetched'> = $props()

	const viewDomId = $derived('dydx-chain-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import DydxChainMarketsView from '$/views/DydxChainMarketsView.svelte'
	import DydxChainNetwork_TimestampsView from '$/views/DydxChainNetwork_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'dydx chain network'}
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
			id={viewDomId + '-carousel-dydx-markets-trading'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'dydx-markets',
						label: 'Markets',
					},
				]
			}
			data-card
			class='network-view-collapsible-markets-trading'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Markets and trading</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionDydxMarkets({ id, label })}
				<DydxChainMarketsView
					selection={selection.$$markets}
					collapsible={false}
					title={label}
					emptyText='No dYdX markets.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-dydx-chain-indexer'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'dydx-chain-observations',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-chain-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Chain and indexer</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionDydxChainObservations({ id, label })}
				<DydxChainNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No dYdX network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
