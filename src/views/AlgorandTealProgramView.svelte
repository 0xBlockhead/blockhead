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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandTealProgram>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AlgorandTealProgram>>
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
	const algorandTealProgram = $derived(selection({
		fields: {
			programKind: true,
			tealVersion: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.programHash) ?? '')].filter(Boolean).join(' ') || 'algorand teal program')
	const viewDomId = $derived('algorand-teal-program-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={algorandTealProgram}>
			{#snippet Pending()}
				{[String((pendingEntity.programHash) ?? '')].filter(Boolean).join(' ') || title || 'algorand teal program'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.programHash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={algorandTealProgram}>
			{#snippet Pending()}
				{[String((pendingEntity.programKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.programHash) ?? '')].filter(Boolean).join(' ') || title || 'algorand teal program'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.programKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.programHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={algorandTealProgram}>
			{#snippet Pending()}
				{@const tealVersion0 = pendingEntity.tealVersion}
				{#if tealVersion0 !== undefined && tealVersion0 !== null}
					<span data-text="muted">
						{String((tealVersion0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const tealVersion0 = resolvedEntity.tealVersion}
				{#if tealVersion0 !== undefined && tealVersion0 !== null}
					<span data-text="muted">
						{String((tealVersion0) ?? '')}
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
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>program hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									programHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const programHash = pendingEntity.programHash}
							{#if programHash !== undefined && programHash !== null}
								<TruncatedValue value={String((programHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const programHash = resolvedEntity.programHash}
							{#if programHash !== undefined && programHash !== null}
								<TruncatedValue value={String((programHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							programKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const programKind = pendingEntity.programKind}
					{#if programKind !== undefined && programKind !== null}
						<div>
							<dt>program kind</dt>
							<dd>
								{String((programKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const programKind = resolvedEntity.programKind}
					{#if programKind !== undefined && programKind !== null}
						<div>
							<dt>program kind</dt>
							<dd>
								{String((programKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tealVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tealVersion = pendingEntity.tealVersion}
					{#if tealVersion !== undefined && tealVersion !== null}
						<div>
							<dt>teal version</dt>
							<dd>
								{String((tealVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tealVersion = resolvedEntity.tealVersion}
					{#if tealVersion !== undefined && tealVersion !== null}
						<div>
							<dt>teal version</dt>
							<dd>
								{String((tealVersion) ?? '')}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Usage</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAlgorandTealApplications({ id, label, open })}
					<AlgorandApplicationsView
						selection={selection.$$applications}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Algorand applications.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAlgorandTealTransactions({ id, label, open })}
					<AlgorandTransactionsView
						selection={selection.$$transactions}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Algorand transactions.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAlgorandTealTimestamps({ id, label, open })}
					<AlgorandTealProgram_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Algorand TEAL program observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
