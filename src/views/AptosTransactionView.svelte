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
	}: EntitySelectionViewProps<EntityType.AptosTransaction> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const aptosTransaction = $derived(selection({
		fields: {
			hash: true,
			transactionKind: true,
			version: true,
			sender: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.hash ?? '') || String(pendingEntity.version ?? '') || 'aptos transaction')
	const viewDomId = $derived('aptos-transaction-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosNetworkView from '$/views/AptosNetworkView.svelte'
	import AptosStateChangesView from '$/views/AptosStateChangesView.svelte'
	import AptosEventsView from '$/views/AptosEventsView.svelte'
	import AptosTransaction_TimestampsView from '$/views/AptosTransaction_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosTransaction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aptosTransaction}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.hash} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosTransaction}>
			{#snippet children(entity)}
				{(entity.transactionKind ?? '') || entity.hash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aptosTransaction}>
			{#snippet children(entity)}
				{@const sender0 = entity.sender}
				{#if sender0 != null}
					<span data-text="muted">
						{sender0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>version</dt>
				<dd>
					<ResourceBoundary
						resource={aptosTransaction}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.version}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={aptosTransaction}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.hash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={aptosTransaction}
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
				resource={aptosTransaction}
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

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-aptos-tx-effects'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'aptos-tx-state-changes',
						label: 'State changes',
					},
					{
						id: 'aptos-tx-events',
						label: 'Events',
					},
				]
			}
			data-card
			class='network-view-collapsible-effects'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Effects</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAptosTxStateChanges({ id, label, open })}
				<AptosStateChangesView
					selection={selection.$$stateChanges}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No state changes found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAptosTxEvents({ id, label, open })}
				<AptosEventsView
					selection={selection.$$events}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No events found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-aptos-tx-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'aptos-tx-timestamps',
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

			{#snippet SectionAptosTxTimestamps({ id, label, open })}
				<AptosTransaction_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
