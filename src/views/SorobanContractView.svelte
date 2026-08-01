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
	}: EntitySelectionViewProps<EntityType.SorobanContract> = $props()

	const viewDomId = $derived('soroban-contract-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
	import SorobanContractStorageEntriesView from '$/views/SorobanContractStorageEntriesView.svelte'
</script>


<EntityView
	entityType={EntityType.SorobanContract}
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
					<StellarNetworkView
						selection={select(EntityType.StellarNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>contract ID</dt>
				<dd>
					{selection.entitySelector.contractId}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-soroban-contract-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'soroban-contract-storage-entries',
						label: 'Storage Entries',
					},
					{
						id: 'soroban-contract-transactions',
						label: 'Transactions',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionSorobanContractStorageEntries({ id, label, open })}
				<SorobanContractStorageEntriesView
					selection={selection.$$storageEntries}
					collapsible={false}
					title={label}
					emptyText='No storage entries.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSorobanContractTransactions({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarTransaction}
					collapsible={false}
					title={label}
					emptyText='No transactions.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$transactions()}
				>
					{#snippet Item({ item: stellarTransaction })}
						<EntityView
							entityType={EntityType.StellarTransaction}
							entitySelector={stellarTransaction[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-soroban-contract-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'soroban-contract-timestamps',
						label: 'Timestamps',
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

			{#snippet SectionSorobanContractTimestamps({ id, label, open })}
				<EntitiesList
					entityType={EntityType.SorobanContract_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: sorobanContractTimestamp })}
						<EntityView
							entityType={EntityType.SorobanContract_Timestamp}
							entitySelector={sorobanContractTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
