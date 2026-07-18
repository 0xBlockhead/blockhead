<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.ScalingDeploymentClaim_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ScalingDeploymentClaim_Timestamp>>
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
	const scalingDeploymentClaimTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			architectureKind: true,
			protocolLabel: true,
			stack: true,
			proofSystemKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.architectureKind) ?? ''), String((pendingEntity.protocolLabel) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim timestamp')
	const viewDomId = $derived('scaling-deployment-claim-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ScalingDeploymentClaimView from '$/views/ScalingDeploymentClaimView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ScalingDeploymentClaim_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.architectureKind) ?? ''), String((pendingEntity.protocolLabel) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={scalingDeploymentClaimTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.architectureKind) ?? ''), String((resolvedEntity.protocolLabel) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.architectureKind) ?? ''), String((pendingEntity.stack) ?? ''), String((pendingEntity.proofSystemKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.architectureKind) ?? ''), String((pendingEntity.protocolLabel) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={scalingDeploymentClaimTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.architectureKind) ?? ''), String((resolvedEntity.stack) ?? ''), String((resolvedEntity.proofSystemKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.architectureKind) ?? ''), String((resolvedEntity.protocolLabel) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<span data-text="muted">
				<ScalingDeploymentClaimView
					selection={select(EntityType.ScalingDeploymentClaim, selection.entitySelector.$claim)}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={scalingDeploymentClaimTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<span data-text="muted">
						<ScalingDeploymentClaimView
							selection={select(EntityType.ScalingDeploymentClaim, selection.entitySelector.$claim)}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Claim</dt>
				<dd>
					<ScalingDeploymentClaimView
						selection={select(EntityType.ScalingDeploymentClaim, selection.entitySelector.$claim, {})}
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
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							sourceUpdatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceUpdatedAt = resolvedEntity.sourceUpdatedAt}
					{#if sourceUpdatedAt !== undefined && sourceUpdatedAt !== null}
						<div>
							<dt>Source updated at</dt>
							<dd>
								<Timestamp timestamp={Number(sourceUpdatedAt)} />
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
							architectureKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const architectureKind = resolvedEntity.architectureKind}
					{#if architectureKind !== undefined && architectureKind !== null}
						<div>
							<dt>Architecture kind</dt>
							<dd>
								{String((architectureKind) ?? '')}
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
							stack: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stack = resolvedEntity.stack}
					{#if stack !== undefined && stack !== null}
						<div>
							<dt>Stack</dt>
							<dd>
								{String((stack) ?? '')}
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
							protocolId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolId = resolvedEntity.protocolId}
					{#if protocolId !== undefined && protocolId !== null}
						<div>
							<dt>Protocol ID</dt>
							<dd>
								{String((protocolId) ?? '')}
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
							protocolLabel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolLabel = resolvedEntity.protocolLabel}
					{#if protocolLabel !== undefined && protocolLabel !== null}
						<div>
							<dt>Protocol label</dt>
							<dd>
								{String((protocolLabel) ?? '')}
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
							protocolKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolKind = resolvedEntity.protocolKind}
					{#if protocolKind !== undefined && protocolKind !== null}
						<div>
							<dt>Protocol kind</dt>
							<dd>
								{String((protocolKind) ?? '')}
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
							proofSystemKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proofSystemKind = resolvedEntity.proofSystemKind}
					{#if proofSystemKind !== undefined && proofSystemKind !== null}
						<div>
							<dt>Proof system kind</dt>
							<dd>
								{String((proofSystemKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$settlementNetwork}
			>
				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : undefined)
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							batchInboxAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const batchInboxAddress = resolvedEntity.batchInboxAddress}
					{#if batchInboxAddress !== undefined && batchInboxAddress !== null}
						<div>
							<dt>Batch inbox address</dt>
							<dd>
								<TruncatedValue value={String((batchInboxAddress) ?? '')} />
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
							dataAvailabilityKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataAvailabilityKind = resolvedEntity.dataAvailabilityKind}
					{#if dataAvailabilityKind !== undefined && dataAvailabilityKind !== null}
						<div>
							<dt>Data availability kind</dt>
							<dd>
								{String((dataAvailabilityKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$dataAvailabilityNetwork}
			>
				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>Data availability network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : undefined)
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
							chainConfigUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chainConfigUrl = resolvedEntity.chainConfigUrl}
					{#if chainConfigUrl !== undefined && chainConfigUrl !== null}
						<div>
							<dt>Chain config URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(chainConfigUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(chainConfigUrl)} />
								</svelte:element>
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
							derivationSpecUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const derivationSpecUrl = resolvedEntity.derivationSpecUrl}
					{#if derivationSpecUrl !== undefined && derivationSpecUrl !== null}
						<div>
							<dt>Derivation spec URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(derivationSpecUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(derivationSpecUrl)} />
								</svelte:element>
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
							publicRpcUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publicRpcUrl = resolvedEntity.publicRpcUrl}
					{#if publicRpcUrl !== undefined && publicRpcUrl !== null}
						<div>
							<dt>Public RPC URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(publicRpcUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(publicRpcUrl)} />
								</svelte:element>
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
							sequencerRpcUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sequencerRpcUrl = resolvedEntity.sequencerRpcUrl}
					{#if sequencerRpcUrl !== undefined && sequencerRpcUrl !== null}
						<div>
							<dt>Sequencer RPC URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(sequencerRpcUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(sequencerRpcUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
