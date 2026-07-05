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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadFilecoinPendingMessage>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadFilecoinPendingMessage>>
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
	const blockheadFilecoinPendingMessage = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			local: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.messageCid ?? prefetched.messageCid) ?? '')].filter(Boolean).join(' ') || 'blockhead filecoin pending message')
	const viewDomId = $derived('blockhead-filecoin-pending-message-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinNetworkView from '$/views/FilecoinNetworkView.svelte'
	import FilecoinMessageView from '$/views/FilecoinMessageView.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFilecoinPendingMessage}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadFilecoinPendingMessage}>
			{#snippet Pending()}
				{@const messageCid0 = selection.entitySelector.messageCid ?? prefetched.messageCid}
				{#if messageCid0 !== undefined && messageCid0 !== null}
					<TruncatedValue value={String((messageCid0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const messageCid0 = resolvedEntity.messageCid}
				{#if messageCid0 !== undefined && messageCid0 !== null}
					<TruncatedValue value={String((messageCid0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadFilecoinPendingMessage}>
			{#snippet Pending()}
				{@const observedAtMs0 = selection.entitySelector.observedAtMs ?? prefetched.observedAtMs}
				{#if observedAtMs0 !== undefined && observedAtMs0 !== null}
					<Timestamp timestamp={Number(observedAtMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const observedAtMs0 = resolvedEntity.observedAtMs}
				{#if observedAtMs0 !== undefined && observedAtMs0 !== null}
					<Timestamp timestamp={Number(observedAtMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadFilecoinPendingMessage}>
			{#snippet Pending()}
				{@const local0 = prefetched.local}
				{#if local0 !== undefined && local0 !== null}
					<span data-text="muted">
						{local0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const local0 = resolvedEntity.local}
				{#if local0 !== undefined && local0 !== null}
					<span data-text="muted">
						{local0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									nodeId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const nodeId = selection.entitySelector.nodeId ?? prefetched.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const nodeId = resolvedEntity.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>message CID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									messageCid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const messageCid = selection.entitySelector.messageCid ?? prefetched.messageCid}
							{#if messageCid !== undefined && messageCid !== null}
								<TruncatedValue value={String((messageCid) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const messageCid = resolvedEntity.messageCid}
							{#if messageCid !== undefined && messageCid !== null}
								<TruncatedValue value={String((messageCid) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>observed AT ms</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									observedAtMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const observedAtMs = selection.entitySelector.observedAtMs ?? prefetched.observedAtMs}
							{#if observedAtMs !== undefined && observedAtMs !== null}
								<Timestamp timestamp={Number(observedAtMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const observedAtMs = resolvedEntity.observedAtMs}
							{#if observedAtMs !== undefined && observedAtMs !== null}
								<Timestamp timestamp={Number(observedAtMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.FilecoinNetwork, false>('$network')}
			>
				{#snippet children(filecoinNetwork)}
					{#if filecoinNetwork != null && filecoinNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>network</dt>
							<dd>
								<FilecoinNetworkView
									selection={select(EntityType.FilecoinNetwork, filecoinNetwork[EntityMetaKey.Selector])}
									prefetched={filecoinNetwork}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.FilecoinMessage, false>('$message')}
			>
				{#snippet children(filecoinMessage)}
					{#if filecoinMessage != null && filecoinMessage[EntityMetaKey.Selector] != null}
						<div>
							<dt>message</dt>
							<dd>
								<FilecoinMessageView
									selection={select(EntityType.FilecoinMessage, filecoinMessage[EntityMetaKey.Selector])}
									prefetched={filecoinMessage}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.FilecoinActor, false>('$from')}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>from</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.FilecoinActor, false>('$to')}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>to</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									layout={EntityLayout.Title}
									open={false}
								/>
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
							nonce: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nonce = prefetched.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>nonce</dt>
							<dd>
								{String((nonce) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonce = resolvedEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>nonce</dt>
							<dd>
								{String((nonce) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							method: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const method = prefetched.method}
					{#if method !== undefined && method !== null}
						<div>
							<dt>method</dt>
							<dd>
								{String((method) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const method = resolvedEntity.method}
					{#if method !== undefined && method !== null}
						<div>
							<dt>method</dt>
							<dd>
								{String((method) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueAttoFil: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueAttoFil = prefetched.valueAttoFil}
					{#if valueAttoFil !== undefined && valueAttoFil !== null}
						<div>
							<dt>value atto fil</dt>
							<dd>
								{String((valueAttoFil) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueAttoFil = resolvedEntity.valueAttoFil}
					{#if valueAttoFil !== undefined && valueAttoFil !== null}
						<div>
							<dt>value atto fil</dt>
							<dd>
								{String((valueAttoFil) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasLimit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasLimit = prefetched.gasLimit}
					{#if gasLimit !== undefined && gasLimit !== null}
						<div>
							<dt>gas limit</dt>
							<dd>
								{String((gasLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasLimit = resolvedEntity.gasLimit}
					{#if gasLimit !== undefined && gasLimit !== null}
						<div>
							<dt>gas limit</dt>
							<dd>
								{String((gasLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasFeeCapAttoFil: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasFeeCapAttoFil = prefetched.gasFeeCapAttoFil}
					{#if gasFeeCapAttoFil !== undefined && gasFeeCapAttoFil !== null}
						<div>
							<dt>gas fee cap atto fil</dt>
							<dd>
								{String((gasFeeCapAttoFil) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasFeeCapAttoFil = resolvedEntity.gasFeeCapAttoFil}
					{#if gasFeeCapAttoFil !== undefined && gasFeeCapAttoFil !== null}
						<div>
							<dt>gas fee cap atto fil</dt>
							<dd>
								{String((gasFeeCapAttoFil) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasPremiumAttoFil: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasPremiumAttoFil = prefetched.gasPremiumAttoFil}
					{#if gasPremiumAttoFil !== undefined && gasPremiumAttoFil !== null}
						<div>
							<dt>gas premium atto fil</dt>
							<dd>
								{String((gasPremiumAttoFil) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasPremiumAttoFil = resolvedEntity.gasPremiumAttoFil}
					{#if gasPremiumAttoFil !== undefined && gasPremiumAttoFil !== null}
						<div>
							<dt>gas premium atto fil</dt>
							<dd>
								{String((gasPremiumAttoFil) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signatureType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signatureType = prefetched.signatureType}
					{#if signatureType !== undefined && signatureType !== null}
						<div>
							<dt>signature type</dt>
							<dd>
								<TruncatedValue value={String((signatureType) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signatureType = resolvedEntity.signatureType}
					{#if signatureType !== undefined && signatureType !== null}
						<div>
							<dt>signature type</dt>
							<dd>
								<TruncatedValue value={String((signatureType) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							local: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const local = prefetched.local}
					{#if local !== undefined && local !== null}
						<div>
							<dt>local</dt>
							<dd>
								{local ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const local = resolvedEntity.local}
					{#if local !== undefined && local !== null}
						<div>
							<dt>local</dt>
							<dd>
								{local ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
