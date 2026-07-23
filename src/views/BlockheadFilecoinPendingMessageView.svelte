<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadFilecoinPendingMessage>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadFilecoinPendingMessage>
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
	const blockheadFilecoinPendingMessage = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			local: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			local: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.messageCid) ?? '')].filter(Boolean).join(' ') || 'blockhead filecoin pending message')
	const viewDomId = $derived('blockhead-filecoin-pending-message-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'local')}
			{@const messageCid0 = pendingEntity.messageCid}
			{#if messageCid0 !== undefined && messageCid0 !== null}
				<TruncatedValue value={String((messageCid0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadFilecoinPendingMessage}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const messageCid0 = resolvedEntity.messageCid}
					{#if messageCid0 !== undefined && messageCid0 !== null}
						<TruncatedValue value={String((messageCid0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'local')}
			{@const observedAtMs0 = pendingEntity.observedAtMs}
			{#if observedAtMs0 !== undefined && observedAtMs0 !== null}
				<Timestamp timestamp={Number(observedAtMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadFilecoinPendingMessage}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedAtMs0 = resolvedEntity.observedAtMs}
					{#if observedAtMs0 !== undefined && observedAtMs0 !== null}
						<Timestamp timestamp={Number(observedAtMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'local')}
			{@const local0 = pendingEntity.local}
			{#if local0 !== undefined && local0 !== null}
				<span data-text="muted">
					{local0 ? 'Yes' : 'No'}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadFilecoinPendingMessage}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									nodeId: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									messageCid: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									observedAtMs: true,
								},
							})
						}
					>
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
				resource={selection.$network}
			>
				{#snippet children(filecoinNetwork)}
					{#if filecoinNetwork != null && filecoinNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>network</dt>
							<dd>
								<FilecoinNetworkView
									selection={select(EntityType.FilecoinNetwork, filecoinNetwork[EntityMetaKey.Selector])}
									prefetched={filecoinNetwork}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$message}
			>
				{#snippet children(filecoinMessage)}
					{#if filecoinMessage != null && filecoinMessage[EntityMetaKey.Selector] != null}
						<div>
							<dt>message</dt>
							<dd>
								<FilecoinMessageView
									selection={select(EntityType.FilecoinMessage, filecoinMessage[EntityMetaKey.Selector])}
									prefetched={filecoinMessage}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>from</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									href={
										(
											filecoinActor[EntityMetaKey.Selector] != null && 'address' in filecoinActor[EntityMetaKey.Selector]
											&& filecoinActor[EntityMetaKey.Selector].address != null
											&& filecoinActor[EntityMetaKey.Selector] != null && '$network' in filecoinActor[EntityMetaKey.Selector] ?
												filecoinActor[EntityMetaKey.Selector].$network != null && 'caip2' in filecoinActor[EntityMetaKey.Selector].$network
												&& filecoinActor[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
												address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
												network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													filecoinActor[EntityMetaKey.Selector].$network != null && 'slug' in filecoinActor[EntityMetaKey.Selector].$network
													&& filecoinActor[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
													address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
													network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>to</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									href={
										(
											filecoinActor[EntityMetaKey.Selector] != null && 'address' in filecoinActor[EntityMetaKey.Selector]
											&& filecoinActor[EntityMetaKey.Selector].address != null
											&& filecoinActor[EntityMetaKey.Selector] != null && '$network' in filecoinActor[EntityMetaKey.Selector] ?
												filecoinActor[EntityMetaKey.Selector].$network != null && 'caip2' in filecoinActor[EntityMetaKey.Selector].$network
												&& filecoinActor[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
												address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
												network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													filecoinActor[EntityMetaKey.Selector].$network != null && 'slug' in filecoinActor[EntityMetaKey.Selector].$network
													&& filecoinActor[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
													address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
													network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
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
						sources: selection.sources,
						fields: {
							nonce: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							method: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							valueAttoFil: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							gasLimit: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							gasFeeCapAttoFil: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							gasPremiumAttoFil: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							signatureType: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							local: true,
						},
					})
				}
			>
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
