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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRadiclePeer>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadRadiclePeer>>
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
	const blockheadRadiclePeer = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			connectionKind: true,
			remoteAlias: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.peerNodeId ?? prefetched.peerNodeId) ?? '')].filter(Boolean).join(' ') || 'blockhead radicle peer')
	const viewDomId = $derived('blockhead-radicle-peer-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadRadicleNodeStateView from '$/views/BlockheadRadicleNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRadiclePeer}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadRadiclePeer}>
			{#snippet Pending()}
				{[String((selection.entitySelector.peerNodeId ?? prefetched.peerNodeId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead radicle peer'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.peerNodeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadRadiclePeer}>
			{#snippet Pending()}
				{[String((prefetched.connectionKind) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.peerNodeId ?? prefetched.peerNodeId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead radicle peer'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.connectionKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.peerNodeId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadRadiclePeer}>
			{#snippet Pending()}
				{@const remoteAlias0 = prefetched.remoteAlias}
				{#if remoteAlias0 !== undefined && remoteAlias0 !== null}
					<span data-text="muted">
						{String((remoteAlias0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const remoteAlias0 = resolvedEntity.remoteAlias}
				{#if remoteAlias0 !== undefined && remoteAlias0 !== null}
					<span data-text="muted">
						{String((remoteAlias0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node</dt>
				<dd>
					<BlockheadRadicleNodeStateView
						selection={select(EntityType.BlockheadRadicleNodeState, selection.entitySelector.$node)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>peer node ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									peerNodeId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const peerNodeId = selection.entitySelector.peerNodeId ?? prefetched.peerNodeId}
							{#if peerNodeId !== undefined && peerNodeId !== null}
								{String((peerNodeId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const peerNodeId = resolvedEntity.peerNodeId}
							{#if peerNodeId !== undefined && peerNodeId !== null}
								{String((peerNodeId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							connectionKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const connectionKind = prefetched.connectionKind}
					{#if connectionKind !== undefined && connectionKind !== null}
						<div>
							<dt>connection kind</dt>
							<dd>
								{String((connectionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const connectionKind = resolvedEntity.connectionKind}
					{#if connectionKind !== undefined && connectionKind !== null}
						<div>
							<dt>connection kind</dt>
							<dd>
								{String((connectionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									addresses: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const addresses = prefetched.addresses}
							{#if addresses !== undefined && addresses !== null}
								<TruncatedValue value={(addresses?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const addresses = resolvedEntity.addresses}
							{#if addresses !== undefined && addresses !== null}
								<TruncatedValue value={(addresses?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastSeenMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastSeenMs = prefetched.lastSeenMs}
					{#if lastSeenMs !== undefined && lastSeenMs !== null}
						<div>
							<dt>last seen ms</dt>
							<dd>
								<Timestamp timestamp={Number(lastSeenMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastSeenMs = resolvedEntity.lastSeenMs}
					{#if lastSeenMs !== undefined && lastSeenMs !== null}
						<div>
							<dt>last seen ms</dt>
							<dd>
								<Timestamp timestamp={Number(lastSeenMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							remoteAlias: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const remoteAlias = prefetched.remoteAlias}
					{#if remoteAlias !== undefined && remoteAlias !== null}
						<div>
							<dt>remote alias</dt>
							<dd>
								{String((remoteAlias) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const remoteAlias = resolvedEntity.remoteAlias}
					{#if remoteAlias !== undefined && remoteAlias !== null}
						<div>
							<dt>remote alias</dt>
							<dd>
								{String((remoteAlias) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							remoteDid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const remoteDid = prefetched.remoteDid}
					{#if remoteDid !== undefined && remoteDid !== null}
						<div>
							<dt>remote DID</dt>
							<dd>
								{String((remoteDid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const remoteDid = resolvedEntity.remoteDid}
					{#if remoteDid !== undefined && remoteDid !== null}
						<div>
							<dt>remote DID</dt>
							<dd>
								{String((remoteDid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
