<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import BlockheadSessionActionsComposer from '$/components/BlockheadSessionActionsComposer.svelte'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadSession>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadSession>>
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
		sources: selection.sources,
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
	import BlockheadIntentInvocationsView from '$/views/BlockheadIntentInvocationsView.svelte'
	import BlockheadSessionSimulationsView from '$/views/BlockheadSessionSimulationsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSession}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.id !== undefined ? resolve('/~/session/[sessionId=stringSegment]', {
			sessionId: String(pendingEntity.id ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadSession}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.status) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadSession}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const updatedAt0 = pendingEntity.updatedAt}
			{#if updatedAt0 !== undefined && updatedAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(updatedAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadSession}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									status: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									createdAt: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									updatedAt: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							lockedAt: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							simulationCount: true,
						},
					})
				}
			>
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
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Work</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBlockheadSessionActions({ id, label, open })}
					<article
						id={`${id}-list`}
						data-column-item="flexible"
						data-card
						data-scroll-container
					>
						<BlockheadSessionActionsComposer
							{selection}
							{id}
							{open}
						/>
					</article>
				{/snippet}

				{#snippet SectionBlockheadSessionIntents({ id, label, open })}
					<BlockheadIntentInvocationsView
						selection={selection.$$intentInvocations}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
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
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Simulations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBlockheadSessionSimulationList({ id, label, open })}
					<BlockheadSessionSimulationsView
						selection={selection.$$simulations}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
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
