<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SuiTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SuiTransaction>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const suiTransaction = $derived(selection({}))
	const titleFallback = $derived('Sui transaction')
	const viewDomId = $derived('sui-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiTransaction}>
			{#snippet Pending()}
				{title || 'Sui transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<SuiNetworkView
						selection={select(EntityType.SuiNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>digest</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									digest: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const digest = pendingEntity.digest}
							{#if digest !== undefined && digest !== null}
								<TruncatedValue value={String((digest) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const digest = resolvedEntity.digest}
							{#if digest !== undefined && digest !== null}
								<TruncatedValue value={String((digest) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
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
				{#snippet Pending()}
					{@const transactionKind = pendingEntity.transactionKind}
					{#if transactionKind !== undefined && transactionKind !== null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{String((transactionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionKind = resolvedEntity.transactionKind}
					{#if transactionKind !== undefined && transactionKind !== null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{String((transactionKind) ?? '')}
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
				{#snippet Pending()}
					{@const sender = pendingEntity.sender}
					{#if sender !== undefined && sender !== null}
						<div>
							<dt>sender</dt>
							<dd>
								{String((sender) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sender = resolvedEntity.sender}
					{#if sender !== undefined && sender !== null}
						<div>
							<dt>sender</dt>
							<dd>
								{String((sender) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionSuiTransactionCommands({ id, label, open })}
					<SuiProgrammableTransactionCommandsView
						selection={
							selection.$$commands({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No commands.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSuiTransactionObjectChanges({ id, label, open })}
					<SuiObjectChangesView
						selection={
							selection.$$objectChanges({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No object changes.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Related</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionSuiTransactionBalanceChanges({ id, label, open })}
					<SuiBalanceChangesView
						selection={
							selection.$$balanceChanges({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No balance changes.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSuiTransactionEvents({ id, label, open })}
					<SuiEventsView
						selection={
							selection.$$events({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No events.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionSuiTransactionTimestamps({ id, label, open })}
					<SuiTransaction_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
