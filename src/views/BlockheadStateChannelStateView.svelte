<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadStateChannelState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadStateChannelState>>
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
	const blockheadStateChannelState = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			intent: true,
			allocations: true,
			signatures: true,
			isFinal: true,
			timestamp: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.version ?? prefetched.version) ?? '')].filter(Boolean).join(' ') || 'blockhead state channel state')
	const viewDomId = $derived('blockhead-state-channel-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannelState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadStateChannelState}>
			{#snippet Pending()}
				{[String((selection.entitySelector.version ?? prefetched.version) ?? '')].filter(Boolean).join(' ') || title || 'blockhead state channel state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.version) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadStateChannelState}>
			{#snippet Pending()}
				{[String((prefetched.isFinal) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.version ?? prefetched.version) ?? '')].filter(Boolean).join(' ') || title || 'blockhead state channel state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.isFinal) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.version) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadStateChannelState}>
			{#snippet Pending()}
				{@const timestamp0 = prefetched.timestamp}
				{#if timestamp0 !== undefined && timestamp0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestamp0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestamp0 = resolvedEntity.timestamp}
				{#if timestamp0 !== undefined && timestamp0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestamp0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>channel</dt>
				<dd>
					<BlockheadStateChannelView
						selection={select(EntityType.BlockheadStateChannel, selection.entitySelector.$channel)}
						href={
							(selection.entitySelector.$channel.id !== undefined ? resolve('/channel/[channelId]', {
								channelId: String(selection.entitySelector.$channel.id ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									version: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const version = selection.entitySelector.version ?? prefetched.version}
							{#if version !== undefined && version !== null}
								{String((version) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const version = resolvedEntity.version}
							{#if version !== undefined && version !== null}
								{String((version) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>state data</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									stateData: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const stateData = selection.entitySelector.stateData ?? prefetched.stateData}
							{#if stateData !== undefined && stateData !== null}
								{String((stateData) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const stateData = resolvedEntity.stateData}
							{#if stateData !== undefined && stateData !== null}
								{String((stateData) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>intent</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									intent: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const intent = prefetched.intent}
							{#if intent !== undefined && intent !== null}
								{String((intent) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const intent = resolvedEntity.intent}
							{#if intent !== undefined && intent !== null}
								{String((intent) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>allocations</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									allocations: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const allocations = prefetched.allocations}
							{#if allocations !== undefined && allocations !== null}
								{allocations == null ? '' : String(((allocations).map((allocation) => `${allocation.destination}:${allocation.token}:${allocation.amount}`).join(', ')) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const allocations = resolvedEntity.allocations}
							{#if allocations !== undefined && allocations !== null}
								{allocations == null ? '' : String(((allocations).map((allocation) => `${allocation.destination}:${allocation.token}:${allocation.amount}`).join(', ')) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>signatures</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signatures: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const signatures = prefetched.signatures}
							{#if signatures !== undefined && signatures !== null}
								<TruncatedValue value={signatures == null ? '' : String(((signatures).join(', ')) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signatures = resolvedEntity.signatures}
							{#if signatures !== undefined && signatures !== null}
								<TruncatedValue value={signatures == null ? '' : String(((signatures).join(', ')) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>is final</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									isFinal: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const isFinal = prefetched.isFinal}
							{#if isFinal !== undefined && isFinal !== null}
								{isFinal ? 'Yes' : 'No'}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const isFinal = resolvedEntity.isFinal}
							{#if isFinal !== undefined && isFinal !== null}
								{isFinal ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestamp: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestamp = prefetched.timestamp}
							{#if timestamp !== undefined && timestamp !== null}
								<Timestamp timestamp={Number(timestamp)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestamp = resolvedEntity.timestamp}
							{#if timestamp !== undefined && timestamp !== null}
								<Timestamp timestamp={Number(timestamp)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
