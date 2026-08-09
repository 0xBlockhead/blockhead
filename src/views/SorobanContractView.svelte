<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SorobanContract>, 'prefetched'> = $props()

	const viewDomId = $derived('soroban-contract-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
	import SorobanContractStorageEntriesView from '$/views/SorobanContractStorageEntriesView.svelte'
	import StellarTransactionsView from '$/views/StellarTransactionsView.svelte'
	import SorobanContract_TimestampsView from '$/views/SorobanContract_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.SorobanContract}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/contract/[contractId=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					contractId: selection.entitySelector.contractId,
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

	{#snippet Details()}
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

			{#snippet SectionSorobanContractStorageEntries({ id, label })}
				<SorobanContractStorageEntriesView
					selection={selection.$$storageEntries}
					collapsible={false}
					title={label}
					emptyText='No storage entries.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSorobanContractTransactions({ id, label })}
				<StellarTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No transactions.'
					id={`${id}-list`}
				/>
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

			{#snippet SectionSorobanContractTimestamps({ id, label })}
				<SorobanContract_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
