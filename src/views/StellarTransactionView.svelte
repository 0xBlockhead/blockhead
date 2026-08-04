<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.StellarTransaction>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.StellarHorizon_Rest,
		],
	}))
	const viewDomId = $derived('stellar-transaction-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarTransaction}
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
					<StellarNetworkView
						selection={select(EntityType.StellarNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.hash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourceAccount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceAccount = entity.sourceAccount}
					{#if sourceAccount != null}
						<div>
							<dt>source account</dt>
							<dd>
								<TruncatedValue value={sourceAccount} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-stellar-transaction-related'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'stellar-transaction-operations',
						label: 'Operations',
					},
					{
						id: 'stellar-transaction-timestamps',
						label: 'Timestamps',
					},
				]
			}
			data-card
			class='network-view-collapsible-related'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Related</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionStellarTransactionOperations({ id, label })}
				<EntitiesList
					entityType={EntityType.StellarOperation}
					collapsible={false}
					title={label}
					emptyText='No operations.'
					open={true}
					id={`${id}-list`}
					resource={viewSelection.$$operations()}
				>
					{#snippet Item({ item: stellarOperation })}
						<EntityView
							entityType={EntityType.StellarOperation}
							entitySelector={stellarOperation[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionStellarTransactionTimestamps({ id, label })}
				<EntitiesList
					entityType={EntityType.StellarTransaction_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					open={true}
					id={`${id}-list`}
					resource={viewSelection.$$timestamps()}
				>
					{#snippet Item({ item: stellarTransactionTimestamp })}
						<EntityView
							entityType={EntityType.StellarTransaction_Timestamp}
							entitySelector={stellarTransactionTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
