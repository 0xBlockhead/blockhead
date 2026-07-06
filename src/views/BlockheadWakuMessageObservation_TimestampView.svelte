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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWakuMessageObservation_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadWakuMessageObservation_Timestamp>>
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
	const blockheadWakuMessageObservationTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			contentTopic: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.messageHash ?? prefetched.messageHash) ?? '')].filter(Boolean).join(' ') || 'blockhead waku message observation timestamp')
	const viewDomId = $derived('blockhead-waku-message-observation-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWakuNodeStateView from '$/views/BlockheadWakuNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadWakuMessageObservationTimestamp}>
			{#snippet Pending()}
				{[String((selection.entitySelector.messageHash ?? prefetched.messageHash) ?? '')].filter(Boolean).join(' ') || title || 'blockhead waku message observation timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.messageHash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWakuMessageObservationTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadWakuMessageObservationTimestamp}>
			{#snippet Pending()}
				{@const contentTopic0 = prefetched.contentTopic}
				{#if contentTopic0 !== undefined && contentTopic0 !== null}
					<span data-text="muted">
						{String((contentTopic0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const contentTopic0 = resolvedEntity.contentTopic}
				{#if contentTopic0 !== undefined && contentTopic0 !== null}
					<span data-text="muted">
						{String((contentTopic0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadWakuNodeStateView
						selection={select(EntityType.BlockheadWakuNodeState, selection.entitySelector.$nodeState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>message hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									messageHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const messageHash = selection.entitySelector.messageHash ?? prefetched.messageHash}
							{#if messageHash !== undefined && messageHash !== null}
								<TruncatedValue value={String((messageHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const messageHash = resolvedEntity.messageHash}
							{#if messageHash !== undefined && messageHash !== null}
								<TruncatedValue value={String((messageHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pubsubTopic: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pubsubTopic = prefetched.pubsubTopic}
					{#if pubsubTopic !== undefined && pubsubTopic !== null}
						<div>
							<dt>pubsub topic</dt>
							<dd>
								{String((pubsubTopic) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pubsubTopic = resolvedEntity.pubsubTopic}
					{#if pubsubTopic !== undefined && pubsubTopic !== null}
						<div>
							<dt>pubsub topic</dt>
							<dd>
								{String((pubsubTopic) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contentTopic: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contentTopic = prefetched.contentTopic}
					{#if contentTopic !== undefined && contentTopic !== null}
						<div>
							<dt>content topic</dt>
							<dd>
								{String((contentTopic) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contentTopic = resolvedEntity.contentTopic}
					{#if contentTopic !== undefined && contentTopic !== null}
						<div>
							<dt>content topic</dt>
							<dd>
								{String((contentTopic) ?? '')}
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
							payloadHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const payloadHash = prefetched.payloadHash}
					{#if payloadHash !== undefined && payloadHash !== null}
						<div>
							<dt>payload hash</dt>
							<dd>
								<TruncatedValue value={String((payloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const payloadHash = resolvedEntity.payloadHash}
					{#if payloadHash !== undefined && payloadHash !== null}
						<div>
							<dt>payload hash</dt>
							<dd>
								<TruncatedValue value={String((payloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payloadSizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const payloadSizeBytes = prefetched.payloadSizeBytes}
					{#if payloadSizeBytes !== undefined && payloadSizeBytes !== null}
						<div>
							<dt>payload size bytes</dt>
							<dd>
								<NumberValue value={Number(payloadSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const payloadSizeBytes = resolvedEntity.payloadSizeBytes}
					{#if payloadSizeBytes !== undefined && payloadSizeBytes !== null}
						<div>
							<dt>payload size bytes</dt>
							<dd>
								<NumberValue value={Number(payloadSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const version = prefetched.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								<NumberValue value={Number(version)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								<NumberValue value={Number(version)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ephemeral: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ephemeral = prefetched.ephemeral}
					{#if ephemeral !== undefined && ephemeral !== null}
						<div>
							<dt>ephemeral</dt>
							<dd>
								{ephemeral ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ephemeral = resolvedEntity.ephemeral}
					{#if ephemeral !== undefined && ephemeral !== null}
						<div>
							<dt>ephemeral</dt>
							<dd>
								{ephemeral ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							senderPeerId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const senderPeerId = prefetched.senderPeerId}
					{#if senderPeerId !== undefined && senderPeerId !== null}
						<div>
							<dt>sender peer ID</dt>
							<dd>
								{String((senderPeerId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const senderPeerId = resolvedEntity.senderPeerId}
					{#if senderPeerId !== undefined && senderPeerId !== null}
						<div>
							<dt>sender peer ID</dt>
							<dd>
								{String((senderPeerId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							protocolPath: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const protocolPath = prefetched.protocolPath}
					{#if protocolPath !== undefined && protocolPath !== null}
						<div>
							<dt>protocol path</dt>
							<dd>
								{String((protocolPath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolPath = resolvedEntity.protocolPath}
					{#if protocolPath !== undefined && protocolPath !== null}
						<div>
							<dt>protocol path</dt>
							<dd>
								{String((protocolPath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
