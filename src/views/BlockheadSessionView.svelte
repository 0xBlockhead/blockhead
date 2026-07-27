<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import BlockheadSessionActionsComposer from '$/views/BlockheadSessionActionsComposer.svelte'
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
	}: EntitySelectionViewProps<EntityType.BlockheadSession> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadSession = $derived(viewSelection({
		fields: {
			name: true,
			status: true,
			createdAt: true,
			updatedAt: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.name ?? '') || (pendingEntity.id ?? '') || 'session')
	const viewDomId = $derived('blockhead-session-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/~/session/[sessionId=stringSegment]',
			{
				sessionId: String(selection.entitySelector.id),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadSession}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSession}>
			{#snippet children(entity)}
				{entity.status || (entity.name ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSession}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={Number(entity.updatedAt)} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSession}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSession}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={Number(entity.createdAt)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Updated</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSession}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={Number(entity.updatedAt)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lockedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lockedAt = entity.lockedAt}
					{#if lockedAt != null}
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
					{#if blockheadSessionSimulation != null}
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
					viewSelection({
						fields: {
							simulationCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const simulationCount = entity.simulationCount}
					{#if simulationCount != null}
						<div>
							<dt>Simulation count</dt>
							<dd>
								{String(simulationCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
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
					open={open}
					title={label}
					emptyText='No intent invocations.'
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
					open={open}
					title={label}
					emptyText='No simulations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
