<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aTaskEvent>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.A2aTaskEvent>>
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
	const a2aTaskEvent = $derived(selection({
		sources: [
			Source.A2aService_Http,
		],
		fields: {
			eventKind: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.sequence ?? prefetched.sequence) ?? '')].filter(Boolean).join(' ') || 'A2A task event')
	const viewDomId = $derived('a2a-task-event-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import A2aTaskView from '$/views/A2aTaskView.svelte'
	import A2aArtifactView from '$/views/A2aArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aTaskEvent}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={a2aTaskEvent}>
			{#snippet Pending()}
				{[String((selection.entitySelector.sequence ?? prefetched.sequence) ?? '')].filter(Boolean).join(' ') || title || 'A2A task event'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.sequence) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={a2aTaskEvent}>
			{#snippet Pending()}
				{[String((prefetched.eventKind) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.sequence ?? prefetched.sequence) ?? '')].filter(Boolean).join(' ') || title || 'A2A task event'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.eventKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.sequence) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aTaskEvent}>
			{#snippet Pending()}
				{@const timestampMs0 = prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>task</dt>
				<dd>
					<A2aTaskView
						selection={select(EntityType.A2aTask, selection.entitySelector.$task)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>sequence</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sequence: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const sequence = selection.entitySelector.sequence ?? prefetched.sequence}
							{#if sequence !== undefined && sequence !== null}
								{String((sequence) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sequence = resolvedEntity.sequence}
							{#if sequence !== undefined && sequence !== null}
								{String((sequence) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>event kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									eventKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const eventKind = prefetched.eventKind}
							{#if eventKind !== undefined && eventKind !== null}
								{String((eventKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const eventKind = resolvedEntity.eventKind}
							{#if eventKind !== undefined && eventKind !== null}
								{String((eventKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							state: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const state = prefetched.state}
					{#if state !== undefined && state !== null}
						<div>
							<dt>state</dt>
							<dd>
								{String((state) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const state = resolvedEntity.state}
					{#if state !== undefined && state !== null}
						<div>
							<dt>state</dt>
							<dd>
								{String((state) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							final: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const final = prefetched.final}
					{#if final !== undefined && final !== null}
						<div>
							<dt>final</dt>
							<dd>
								{final ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const final = resolvedEntity.final}
					{#if final !== undefined && final !== null}
						<div>
							<dt>final</dt>
							<dd>
								{final ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.A2aArtifact, false>('$artifact')}
			>
				{#snippet children(a2aArtifact)}
					{#if a2aArtifact != null && a2aArtifact[EntityMetaKey.Selector] != null}
						<div>
							<dt>artifact</dt>
							<dd>
								<A2aArtifactView
									selection={select(EntityType.A2aArtifact, a2aArtifact[EntityMetaKey.Selector])}
									prefetched={a2aArtifact}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
