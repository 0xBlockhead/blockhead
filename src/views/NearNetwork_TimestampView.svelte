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
			selection: EntityProxyResource<typeof schema, EntityType.NearNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NearNetwork_Timestamp>>
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
	const nearNetworkTimestamp = $derived(selection({
		sources: [
			Source.NearRpc_JsonRpc,
		],
		fields: {
			headHeight: true,
			headHash: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'near network timestamp')
	const viewDomId = $derived('near-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearNetworkView from '$/views/NearNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.NearNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nearNetworkTimestamp}>
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

	{#snippet Value()}
		<ResourceBoundary resource={nearNetworkTimestamp}>
			{#snippet Pending()}
				{@const headHeight0 = prefetched.headHeight}
				{#if headHeight0 !== undefined && headHeight0 !== null}
					<NumberValue value={Number(headHeight0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const headHeight0 = resolvedEntity.headHeight}
				{#if headHeight0 !== undefined && headHeight0 !== null}
					<NumberValue value={Number(headHeight0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearNetworkTimestamp}>
			{#snippet Pending()}
				{@const headHash0 = prefetched.headHash}
				{#if headHash0 !== undefined && headHash0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((headHash0) ?? '')} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const headHash0 = resolvedEntity.headHash}
				{#if headHash0 !== undefined && headHash0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((headHash0) ?? '')} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NearNetworkView
						selection={select(EntityType.NearNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
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
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							headHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const headHeight = prefetched.headHeight}
					{#if headHeight !== undefined && headHeight !== null}
						<div>
							<dt>Head height</dt>
							<dd>
								<NumberValue value={Number(headHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const headHeight = resolvedEntity.headHeight}
					{#if headHeight !== undefined && headHeight !== null}
						<div>
							<dt>Head height</dt>
							<dd>
								<NumberValue value={Number(headHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							headHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const headHash = prefetched.headHash}
					{#if headHash !== undefined && headHash !== null}
						<div>
							<dt>Head hash</dt>
							<dd>
								<TruncatedValue value={String((headHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const headHash = resolvedEntity.headHash}
					{#if headHash !== undefined && headHash !== null}
						<div>
							<dt>Head hash</dt>
							<dd>
								<TruncatedValue value={String((headHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							epochId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const epochId = prefetched.epochId}
					{#if epochId !== undefined && epochId !== null}
						<div>
							<dt>Epoch ID</dt>
							<dd>
								{String((epochId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epochId = resolvedEntity.epochId}
					{#if epochId !== undefined && epochId !== null}
						<div>
							<dt>Epoch ID</dt>
							<dd>
								{String((epochId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							epochHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const epochHeight = prefetched.epochHeight}
					{#if epochHeight !== undefined && epochHeight !== null}
						<div>
							<dt>Epoch height</dt>
							<dd>
								<NumberValue value={Number(epochHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epochHeight = resolvedEntity.epochHeight}
					{#if epochHeight !== undefined && epochHeight !== null}
						<div>
							<dt>Epoch height</dt>
							<dd>
								<NumberValue value={Number(epochHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							epochStartHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const epochStartHeight = prefetched.epochStartHeight}
					{#if epochStartHeight !== undefined && epochStartHeight !== null}
						<div>
							<dt>Epoch start height</dt>
							<dd>
								<NumberValue value={Number(epochStartHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epochStartHeight = resolvedEntity.epochStartHeight}
					{#if epochStartHeight !== undefined && epochStartHeight !== null}
						<div>
							<dt>Epoch start height</dt>
							<dd>
								<NumberValue value={Number(epochStartHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							gasPriceYoctoNear: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasPriceYoctoNear = prefetched.gasPriceYoctoNear}
					{#if gasPriceYoctoNear !== undefined && gasPriceYoctoNear !== null}
						<div>
							<dt>Gas price yocto near</dt>
							<dd>
								<NumberValue value={Number(gasPriceYoctoNear)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasPriceYoctoNear = resolvedEntity.gasPriceYoctoNear}
					{#if gasPriceYoctoNear !== undefined && gasPriceYoctoNear !== null}
						<div>
							<dt>Gas price yocto near</dt>
							<dd>
								<NumberValue value={Number(gasPriceYoctoNear)} />
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
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							chunkCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chunkCount = prefetched.chunkCount}
					{#if chunkCount !== undefined && chunkCount !== null}
						<div>
							<dt>Chunk count</dt>
							<dd>
								<NumberValue value={Number(chunkCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chunkCount = resolvedEntity.chunkCount}
					{#if chunkCount !== undefined && chunkCount !== null}
						<div>
							<dt>Chunk count</dt>
							<dd>
								<NumberValue value={Number(chunkCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							currentValidatorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const currentValidatorCount = prefetched.currentValidatorCount}
					{#if currentValidatorCount !== undefined && currentValidatorCount !== null}
						<div>
							<dt>Current validators</dt>
							<dd>
								<NumberValue value={Number(currentValidatorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const currentValidatorCount = resolvedEntity.currentValidatorCount}
					{#if currentValidatorCount !== undefined && currentValidatorCount !== null}
						<div>
							<dt>Current validators</dt>
							<dd>
								<NumberValue value={Number(currentValidatorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							nextValidatorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nextValidatorCount = prefetched.nextValidatorCount}
					{#if nextValidatorCount !== undefined && nextValidatorCount !== null}
						<div>
							<dt>Next validators</dt>
							<dd>
								<NumberValue value={Number(nextValidatorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nextValidatorCount = resolvedEntity.nextValidatorCount}
					{#if nextValidatorCount !== undefined && nextValidatorCount !== null}
						<div>
							<dt>Next validators</dt>
							<dd>
								<NumberValue value={Number(nextValidatorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							currentProposalCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const currentProposalCount = prefetched.currentProposalCount}
					{#if currentProposalCount !== undefined && currentProposalCount !== null}
						<div>
							<dt>Current proposals</dt>
							<dd>
								<NumberValue value={Number(currentProposalCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const currentProposalCount = resolvedEntity.currentProposalCount}
					{#if currentProposalCount !== undefined && currentProposalCount !== null}
						<div>
							<dt>Current proposals</dt>
							<dd>
								<NumberValue value={Number(currentProposalCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							protocolVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const protocolVersion = prefetched.protocolVersion}
					{#if protocolVersion !== undefined && protocolVersion !== null}
						<div>
							<dt>Protocol version</dt>
							<dd>
								<NumberValue value={Number(protocolVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolVersion = resolvedEntity.protocolVersion}
					{#if protocolVersion !== undefined && protocolVersion !== null}
						<div>
							<dt>Protocol version</dt>
							<dd>
								<NumberValue value={Number(protocolVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							latestProtocolVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestProtocolVersion = prefetched.latestProtocolVersion}
					{#if latestProtocolVersion !== undefined && latestProtocolVersion !== null}
						<div>
							<dt>Latest protocol version</dt>
							<dd>
								<NumberValue value={Number(latestProtocolVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestProtocolVersion = resolvedEntity.latestProtocolVersion}
					{#if latestProtocolVersion !== undefined && latestProtocolVersion !== null}
						<div>
							<dt>Latest protocol version</dt>
							<dd>
								<NumberValue value={Number(latestProtocolVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							nodeVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeVersion = prefetched.nodeVersion}
					{#if nodeVersion !== undefined && nodeVersion !== null}
						<div>
							<dt>Node version</dt>
							<dd>
								{String((nodeVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeVersion = resolvedEntity.nodeVersion}
					{#if nodeVersion !== undefined && nodeVersion !== null}
						<div>
							<dt>Node version</dt>
							<dd>
								{String((nodeVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							syncing: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const syncing = prefetched.syncing}
					{#if syncing !== undefined && syncing !== null}
						<div>
							<dt>Syncing</dt>
							<dd>
								{syncing ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const syncing = resolvedEntity.syncing}
					{#if syncing !== undefined && syncing !== null}
						<div>
							<dt>Syncing</dt>
							<dd>
								{syncing ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
