<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
	}: EntitySelectionViewProps<EntityType.AlgorandTealProgram> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const algorandTealProgram = $derived(selection({
		fields: {
			programKind: true,
			tealVersion: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.programHash ?? '') || 'algorand teal program')
	const viewDomId = $derived('algorand-teal-program-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
	import AlgorandApplicationsView from '$/views/AlgorandApplicationsView.svelte'
	import AlgorandTransactionsView from '$/views/AlgorandTransactionsView.svelte'
	import AlgorandTealProgram_TimestampsView from '$/views/AlgorandTealProgram_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandTealProgram}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{String(pendingEntity.programHash ?? '') || 'algorand teal program'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={algorandTealProgram}>
			{#snippet children(entity)}
				{(entity.programKind ?? '') || String(pendingEntity.programHash) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={algorandTealProgram}>
			{#snippet children(entity)}
				{@const tealVersion0 = entity.tealVersion}
				{#if tealVersion0 != null}
					<span data-text="muted">
						{String(tealVersion0)}
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
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>program hash</dt>
				<dd>
					<TruncatedValue value={String(pendingEntity.programHash)} />
				</dd>
			</div>

			<ResourceBoundary
				resource={algorandTealProgram}
			>
				{#snippet children(entity)}
					{@const programKind = entity.programKind}
					{#if programKind != null}
						<div>
							<dt>program kind</dt>
							<dd>
								{programKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={algorandTealProgram}
			>
				{#snippet children(entity)}
					{@const tealVersion = entity.tealVersion}
					{#if tealVersion != null}
						<div>
							<dt>teal version</dt>
							<dd>
								{String(tealVersion)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-algorand-teal-usage'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'algorand-teal-applications',
						label: 'Applications',
					},
					{
						id: 'algorand-teal-transactions',
						label: 'Transactions',
					},
				]
			}
			data-card
			class='network-view-collapsible-usage'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Usage</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAlgorandTealApplications({ id, label, open })}
				<AlgorandApplicationsView
					selection={selection.$$applications}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand applications.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAlgorandTealTransactions({ id, label, open })}
				<AlgorandTransactionsView
					selection={selection.$$transactions}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-algorand-teal-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'algorand-teal-timestamps',
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

			{#snippet SectionAlgorandTealTimestamps({ id, label, open })}
				<AlgorandTealProgram_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand TEAL program observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
