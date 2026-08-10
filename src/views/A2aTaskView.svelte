<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
	}: EntitySelectionViewProps<EntityType.A2aTask> = $props()

	const service = $derived(selection.entitySelector.$service)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [],
	}))
	const a2aTask = $derived(viewSelection({
		fields: {
			taskId: true,
			contextId: true,
			providerTaskId: true,
			updatedAt: true,
		},
	}))
	const titleFallback = $derived((prefetched.taskId ?? '') || (prefetched.providerTaskId ?? '') || 'A2A task')
	const viewDomId = $derived('a2a-task-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import A2aAgentServiceView from '$/views/A2aAgentServiceView.svelte'
	import A2aTaskEventsView from '$/views/A2aTaskEventsView.svelte'
	import A2aMessagesView from '$/views/A2aMessagesView.svelte'
	import A2aArtifactsView from '$/views/A2aArtifactsView.svelte'
	import A2aPushNotificationConfigsView from '$/views/A2aPushNotificationConfigsView.svelte'
	import A2aTask_TimestampsView from '$/views/A2aTask_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aTask}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'providerTaskId' in selection.entitySelector
				&& '$service' in selection.entitySelector ?
					resolve(
						'/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]/(a2aAgentCard)/service/[protocolBinding=stringSegment]/[endpointUrl=absoluteUrl]/(a2aAgentService)/task/[providerTaskId=stringSegment]',
						{
							agentCardUrl: encodeURIComponent(service.$card.agentCardUrl),
							protocolBinding: service.protocolBinding,
							endpointUrl: encodeURIComponent(service.endpointUrl),
							providerTaskId: selection.entitySelector.providerTaskId,
						}
					)
				:
					'taskId' in selection.entitySelector ?
						resolve(
							'/(agents)/agents/a2a/task/[taskId=stringSegment]',
							{
								taskId: selection.entitySelector.taskId,
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={a2aTask}>
			{#snippet children(entity)}
				{entity.taskId || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={a2aTask}>
			{#snippet children(entity)}
				{(entity.contextId ?? '') || entity.taskId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aTask}>
			{#snippet children(entity)}
				{@const updatedAt = entity.updatedAt}
				{#if updatedAt != null}
					<span data-text="muted">
						<Timestamp timestamp={updatedAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>task ID</dt>
				<dd>
					<ResourceBoundary
						resource={a2aTask}
					>
						{#snippet children(entity)}
							{entity.taskId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$service}
			>
				{#snippet children(a2aAgentService)}
					{#if a2aAgentService != null}
						{@const a2aAgentServiceInitial = untrack(() => a2aAgentService)}
						<div>
							<dt>service</dt>
							<dd>
								<A2aAgentServiceView
									selection={select(EntityType.A2aAgentService, (a2aAgentService ?? a2aAgentServiceInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={a2aTask}
			>
				{#snippet children(entity)}
					{@const providerTaskId = entity.providerTaskId}
					{#if providerTaskId != null}
						<div>
							<dt>provider task ID</dt>
							<dd>
								{providerTaskId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={a2aTask}
			>
				{#snippet children(entity)}
					{@const contextId = entity.contextId}
					{#if contextId != null}
						<div>
							<dt>context ID</dt>
							<dd>
								{contextId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={a2aTask}
			>
				{#snippet children(entity)}
					{@const updatedAt = entity.updatedAt}
					{#if updatedAt != null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={updatedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cancelledAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cancelledAt = entity.cancelledAt}
					{#if cancelledAt != null}
						<div>
							<dt>cancelled AT</dt>
							<dd>
								<Timestamp timestamp={cancelledAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							listed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const listed = entity.listed}
					{#if listed != null}
						<div>
							<dt>listed</dt>
							<dd>
								{listed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-a2a-task-conversation'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'a2a-task-events',
						label: 'Events',
					},
					{
						id: 'a2a-task-messages',
						label: 'Messages',
					},
					{
						id: 'a2a-task-artifacts',
						label: 'Artifacts',
					},
				]
			}
			data-card
			class='network-view-collapsible-conversation'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Conversation</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionA2aTaskEvents({ id, label })}
				<A2aTaskEventsView
					selection={selection.$$events}
					collapsible={false}
					title={label}
					emptyText='No A2A task events.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionA2aTaskMessages({ id, label })}
				<A2aMessagesView
					selection={selection.$$messages}
					collapsible={false}
					title={label}
					emptyText='No A2A messages.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionA2aTaskArtifacts({ id, label })}
				<A2aArtifactsView
					selection={selection.$$artifacts}
					collapsible={false}
					title={label}
					emptyText='No A2A artifacts.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-a2a-task-delivery'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'a2a-task-push',
						label: 'Push notification configs',
					},
					{
						id: 'a2a-task-observations',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-delivery'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Delivery and observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionA2aTaskPush({ id, label })}
				<A2aPushNotificationConfigsView
					selection={selection.$$pushNotificationConfigs}
					collapsible={false}
					title={label}
					emptyText='No A2A push notification configs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionA2aTaskObservations({ id, label })}
				<A2aTask_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No A2A task observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
