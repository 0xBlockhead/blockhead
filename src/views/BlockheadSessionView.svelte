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
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSession>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadSession>>
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
	const blockheadSession = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
			status: true,
			createdAt: true,
			updatedAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'session')
	const viewDomId = $derived('blockhead-session-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSessionSimulationView from '$/views/BlockheadSessionSimulationView.svelte'
	import BlockheadSessionActionsView from '$/views/BlockheadSessionActionsView.svelte'
	import BlockheadIntentInvocationsView from '$/views/BlockheadIntentInvocationsView.svelte'
	import BlockheadSessionSimulationsView from '$/views/BlockheadSessionSimulationsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSession}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadSession}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'session'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSession}>
			{#snippet Pending()}
				{[String((pendingEntity.status) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'session'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSession}>
			{#snippet Pending()}
				{@const updatedAt0 = pendingEntity.updatedAt}
				{#if updatedAt0 !== undefined && updatedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(updatedAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const updatedAt0 = resolvedEntity.updatedAt}
				{#if updatedAt0 !== undefined && updatedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(updatedAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									status: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const status = pendingEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdAt = pendingEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Updated</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									updatedAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const updatedAt = pendingEntity.updatedAt}
							{#if updatedAt !== undefined && updatedAt !== null}
								<Timestamp timestamp={Number(updatedAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const updatedAt = resolvedEntity.updatedAt}
							{#if updatedAt !== undefined && updatedAt !== null}
								<Timestamp timestamp={Number(updatedAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lockedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lockedAt = pendingEntity.lockedAt}
					{#if lockedAt !== undefined && lockedAt !== null}
						<div>
							<dt>Locked</dt>
							<dd>
								<Timestamp timestamp={Number(lockedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lockedAt = resolvedEntity.lockedAt}
					{#if lockedAt !== undefined && lockedAt !== null}
						<div>
							<dt>Locked</dt>
							<dd>
								<Timestamp timestamp={Number(lockedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$latestSimulation}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadSessionSimulation)}
					{#if blockheadSessionSimulation != null && blockheadSessionSimulation[EntityMetaKey.Selector] != null}
						<div>
							<dt>Latest simulation</dt>
							<dd>
								<BlockheadSessionSimulationView
									selection={select(EntityType.BlockheadSessionSimulation, blockheadSessionSimulation[EntityMetaKey.Selector])}
									prefetched={blockheadSessionSimulation}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							simulationCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const simulationCount = pendingEntity.simulationCount}
					{#if simulationCount !== undefined && simulationCount !== null}
						<div>
							<dt>Simulation count</dt>
							<dd>
								{String((simulationCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const simulationCount = resolvedEntity.simulationCount}
					{#if simulationCount !== undefined && simulationCount !== null}
						<div>
							<dt>Simulation count</dt>
							<dd>
								{String((simulationCount) ?? '')}
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
				id={viewDomId + '-carousel-blockhead-session-work'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'blockhead-session-actions',
							label: 'Actions',
						},
						{
							id: 'blockhead-session-intents',
							label: 'Intent invocations',
						},
					]
				}
				data-card
				class='network-view-collapsible-work'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Work</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBlockheadSessionActions({ id, label, open })}
					<BlockheadSessionActionsView
						selection={
							selection.$$actions({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No actions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionBlockheadSessionIntents({ id, label, open })}
					<BlockheadIntentInvocationsView
						selection={
							selection.$$intentInvocations({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No intent invocations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-blockhead-session-simulations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'blockhead-session-simulation-list',
							label: 'Simulations',
						},
					]
				}
				data-card
				class='network-view-collapsible-simulations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Simulations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBlockheadSessionSimulationList({ id, label, open })}
					<BlockheadSessionSimulationsView
						selection={
							selection.$$simulations({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No simulations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
