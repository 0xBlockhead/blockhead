<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SuiTransaction>, 'prefetched'> = $props()

	const viewDomId = $derived('sui-transaction-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
	import SuiProgrammableTransactionCommandsView from '$/views/SuiProgrammableTransactionCommandsView.svelte'
	import SuiObjectChangesView from '$/views/SuiObjectChangesView.svelte'
	import SuiBalanceChangesView from '$/views/SuiBalanceChangesView.svelte'
	import SuiEventsView from '$/views/SuiEventsView.svelte'
	import SuiTransaction_TimestampsView from '$/views/SuiTransaction_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiTransaction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'Sui transaction'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<SuiNetworkView
						selection={select(EntityType.SuiNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>digest</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.digest} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionKind = entity.transactionKind}
					{#if transactionKind != null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{transactionKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sender: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sender = entity.sender}
					{#if sender != null}
						<div>
							<dt>sender</dt>
							<dd>
								{sender}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-sui-transaction-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'sui-transaction-commands',
						label: 'Commands',
					},
					{
						id: 'sui-transaction-object-changes',
						label: 'Object Changes',
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

			{#snippet SectionSuiTransactionCommands({ id, label })}
				<SuiProgrammableTransactionCommandsView
					selection={selection.$$commands}
					collapsible={false}
					title={label}
					emptyText='No commands.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSuiTransactionObjectChanges({ id, label })}
				<SuiObjectChangesView
					selection={selection.$$objectChanges}
					collapsible={false}
					title={label}
					emptyText='No object changes.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-sui-transaction-related'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'sui-transaction-balance-changes',
						label: 'Balance Changes',
					},
					{
						id: 'sui-transaction-events',
						label: 'Events',
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

			{#snippet SectionSuiTransactionBalanceChanges({ id, label })}
				<SuiBalanceChangesView
					selection={selection.$$balanceChanges}
					collapsible={false}
					title={label}
					emptyText='No balance changes.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSuiTransactionEvents({ id, label })}
				<SuiEventsView
					selection={selection.$$events}
					collapsible={false}
					title={label}
					emptyText='No events.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-sui-transaction-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'sui-transaction-timestamps',
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

			{#snippet SectionSuiTransactionTimestamps({ id, label })}
				<SuiTransaction_TimestampsView
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
