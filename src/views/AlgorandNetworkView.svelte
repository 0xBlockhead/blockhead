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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AlgorandNetwork>, 'prefetched'> = $props()

	const viewDomId = $derived('algorand-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import AlgorandTransactionsView from '$/views/AlgorandTransactionsView.svelte'
	import AlgorandAssetsView from '$/views/AlgorandAssetsView.svelte'
	import AlgorandApplicationsView from '$/views/AlgorandApplicationsView.svelte'
	import AlgorandTealProgramsView from '$/views/AlgorandTealProgramsView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	{layout}
	bind:open
	{...EntityViewProps}
>
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
			id={viewDomId + '-carousel-algorand-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'algorand-chain-observations',
						label: 'Observations',
					},
					{
						id: 'algorand-chain-rounds',
						label: 'Rounds',
					},
					{
						id: 'algorand-chain-transactions',
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

			{#snippet SectionAlgorandChainObservations({ id, label })}
				<EntitiesList
					entityType={EntityType.AlgorandNetwork_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No Algorand network observations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: algorandNetworkTimestamp })}
						<EntityView
							entityType={EntityType.AlgorandNetwork_Timestamp}
							entitySelector={algorandNetworkTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionAlgorandChainRounds({ id, label })}
				<EntitiesList
					entityType={EntityType.AlgorandRound}
					collapsible={false}
					title={label}
					emptyText='No Algorand rounds.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$rounds()}
				>
					{#snippet Item({ item: algorandRound })}
						<EntityView
							entityType={EntityType.AlgorandRound}
							entitySelector={algorandRound[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionAlgorandChainTransactions({ id, label })}
				<AlgorandTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No Algorand transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-algorand-accounts-assets'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'algorand-accounts',
						label: 'Accounts',
					},
					{
						id: 'algorand-assets',
						label: 'Assets',
					},
				]
			}
			data-card
			class='network-view-collapsible-accounts-assets'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Accounts and assets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAlgorandAccounts({ id, label })}
				<EntitiesList
					entityType={EntityType.AlgorandAccount}
					collapsible={false}
					title={label}
					emptyText='No Algorand accounts.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$accounts()}
				>
					{#snippet Item({ item: algorandAccount })}
						<EntityView
							entityType={EntityType.AlgorandAccount}
							entitySelector={algorandAccount[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionAlgorandAssets({ id, label })}
				<AlgorandAssetsView
					selection={selection.$$assets}
					collapsible={false}
					title={label}
					emptyText='No Algorand assets.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-algorand-applications'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'algorand-application-list',
						label: 'Applications',
					},
					{
						id: 'algorand-teal-programs',
						label: 'TEAL programs',
					},
				]
			}
			data-card
			class='network-view-collapsible-applications'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Applications</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAlgorandApplicationList({ id, label })}
				<AlgorandApplicationsView
					selection={selection.$$applications}
					collapsible={false}
					title={label}
					emptyText='No Algorand applications.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAlgorandTealPrograms({ id, label })}
				<AlgorandTealProgramsView
					selection={selection.$$tealPrograms}
					collapsible={false}
					title={label}
					emptyText='No Algorand TEAL programs.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
