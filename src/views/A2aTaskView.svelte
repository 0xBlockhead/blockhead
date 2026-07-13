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
			selection: EntityProxyResource<typeof schema, EntityType.A2aTask>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.A2aTask>>
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
	const a2aTask = $derived(selection({
		sources: [
			Source.A2aService_Http,
		],
		fields: {
			contextId: true,
			updatedAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.taskId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.providerTaskId) ?? '')].filter(Boolean).join(' ') || 'A2A task')
	const viewDomId = $derived('a2a-task-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={a2aTask}>
			{#snippet Pending()}
				{[String((pendingEntity.taskId) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.providerTaskId) ?? '')].filter(Boolean).join(' ') || 'A2A task'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.taskId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={a2aTask}>
			{#snippet Pending()}
				{[String((pendingEntity.contextId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.taskId) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.providerTaskId) ?? '')].filter(Boolean).join(' ') || 'A2A task'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.contextId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.taskId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aTask}>
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							taskId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const taskId = pendingEntity.taskId}
					{#if taskId !== undefined && taskId !== null}
						<div>
							<dt>task ID</dt>
							<dd>
								{String((taskId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const taskId = resolvedEntity.taskId}
					{#if taskId !== undefined && taskId !== null}
						<div>
							<dt>task ID</dt>
							<dd>
								{String((taskId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$service}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(a2aAgentService)}
					{#if a2aAgentService != null && a2aAgentService[EntityMetaKey.Selector] != null}
						<div>
							<dt>service</dt>
							<dd>
								<A2aAgentServiceView
									selection={select(EntityType.A2aAgentService, a2aAgentService[EntityMetaKey.Selector])}
									prefetched={a2aAgentService}
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
							providerTaskId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerTaskId = pendingEntity.providerTaskId}
					{#if providerTaskId !== undefined && providerTaskId !== null}
						<div>
							<dt>provider task ID</dt>
							<dd>
								{String((providerTaskId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerTaskId = resolvedEntity.providerTaskId}
					{#if providerTaskId !== undefined && providerTaskId !== null}
						<div>
							<dt>provider task ID</dt>
							<dd>
								{String((providerTaskId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contextId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contextId = pendingEntity.contextId}
					{#if contextId !== undefined && contextId !== null}
						<div>
							<dt>context ID</dt>
							<dd>
								{String((contextId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contextId = resolvedEntity.contextId}
					{#if contextId !== undefined && contextId !== null}
						<div>
							<dt>context ID</dt>
							<dd>
								{String((contextId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
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
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt = resolvedEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cancelledAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cancelledAt = pendingEntity.cancelledAt}
					{#if cancelledAt !== undefined && cancelledAt !== null}
						<div>
							<dt>cancelled AT</dt>
							<dd>
								<Timestamp timestamp={Number(cancelledAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cancelledAt = resolvedEntity.cancelledAt}
					{#if cancelledAt !== undefined && cancelledAt !== null}
						<div>
							<dt>cancelled AT</dt>
							<dd>
								<Timestamp timestamp={Number(cancelledAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							listed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const listed = pendingEntity.listed}
					{#if listed !== undefined && listed !== null}
						<div>
							<dt>listed</dt>
							<dd>
								{listed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const listed = resolvedEntity.listed}
					{#if listed !== undefined && listed !== null}
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

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Conversation</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionA2aTaskEvents({ id, label, open })}
					<A2aTaskEventsView
						selection={
							selection.$$events({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No A2A task events.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionA2aTaskMessages({ id, label, open })}
					<A2aMessagesView
						selection={
							selection.$$messages({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No A2A messages.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionA2aTaskArtifacts({ id, label, open })}
					<A2aArtifactsView
						selection={
							selection.$$artifacts({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No A2A artifacts.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Delivery and observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionA2aTaskPush({ id, label, open })}
					<A2aPushNotificationConfigsView
						selection={
							selection.$$pushNotificationConfigs({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No A2A push notification configs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionA2aTaskObservations({ id, label, open })}
					<A2aTask_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No A2A task observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
