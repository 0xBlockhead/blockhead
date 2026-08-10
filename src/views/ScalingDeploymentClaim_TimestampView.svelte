<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.ScalingDeploymentClaim_Timestamp> = $props()

	const claim = $derived(selection.entitySelector.$claim)
	const scalingDeploymentClaimTimestamp = $derived(selection({
		fields: {
			architectureKind: true,
			protocolLabel: true,
			stack: true,
			proofSystemKind: true,
		},
	}))
	const titleFallback = $derived([(prefetched.architectureKind ?? ''), (prefetched.protocolLabel ?? ''), String(selection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'scaling deployment claim timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ScalingDeploymentClaimView from '$/views/ScalingDeploymentClaimView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ScalingDeploymentClaim_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/scaling/[claimSource=stringSegment]/[sourceProjectId=stringSegment]/(scalingDeploymentClaim)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in claim.$network ?
							caip2StringFromValue(claim.$network.caip2)
						:
							claim.$network.slug
					),
					claimSource: claim.source,
					sourceProjectId: claim.sourceProjectId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={scalingDeploymentClaimTimestamp}>
			{#snippet children(entity)}
				{[(entity.architectureKind ?? ''), (entity.protocolLabel ?? ''), String(selection.entitySelector.timestampMs)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={scalingDeploymentClaimTimestamp}>
			{#snippet children(entity)}
				{[(entity.architectureKind ?? ''), (entity.stack ?? ''), (entity.proofSystemKind ?? '')].filter(Boolean).join(' ') || [(entity.architectureKind ?? ''), (entity.protocolLabel ?? ''), String(selection.entitySelector.timestampMs)].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<ScalingDeploymentClaimView
				selection={select(EntityType.ScalingDeploymentClaim, selection.entitySelector.$claim)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Claim</dt>
				<dd>
					<ScalingDeploymentClaimView
						selection={select(EntityType.ScalingDeploymentClaim, selection.entitySelector.$claim)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceUpdatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceUpdatedAt = entity.sourceUpdatedAt}
					{#if sourceUpdatedAt != null}
						<div>
							<dt>Source updated at</dt>
							<dd>
								<Timestamp timestamp={sourceUpdatedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={scalingDeploymentClaimTimestamp}
			>
				{#snippet children(entity)}
					{@const architectureKind = entity.architectureKind}
					{#if architectureKind != null}
						<div>
							<dt>Architecture kind</dt>
							<dd>
								{architectureKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={scalingDeploymentClaimTimestamp}
			>
				{#snippet children(entity)}
					{@const stack = entity.stack}
					{#if stack != null}
						<div>
							<dt>Stack</dt>
							<dd>
								{stack}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							protocolId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolId = entity.protocolId}
					{#if protocolId != null}
						<div>
							<dt>Protocol ID</dt>
							<dd>
								{protocolId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={scalingDeploymentClaimTimestamp}
			>
				{#snippet children(entity)}
					{@const protocolLabel = entity.protocolLabel}
					{#if protocolLabel != null}
						<div>
							<dt>Protocol label</dt>
							<dd>
								{protocolLabel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							protocolKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolKind = entity.protocolKind}
					{#if protocolKind != null}
						<div>
							<dt>Protocol kind</dt>
							<dd>
								{protocolKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={scalingDeploymentClaimTimestamp}
			>
				{#snippet children(entity)}
					{@const proofSystemKind = entity.proofSystemKind}
					{#if proofSystemKind != null}
						<div>
							<dt>Proof system kind</dt>
							<dd>
								{proofSystemKind}
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
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
									layout={EntityLayout.Value}
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
							batchInboxAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const batchInboxAddress = entity.batchInboxAddress}
					{#if batchInboxAddress != null}
						<div>
							<dt>Batch inbox address</dt>
							<dd>
								<TruncatedValue value={batchInboxAddress} />
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
							dataAvailabilityKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dataAvailabilityKind = entity.dataAvailabilityKind}
					{#if dataAvailabilityKind != null}
						<div>
							<dt>Data availability kind</dt>
							<dd>
								{dataAvailabilityKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$dataAvailabilityNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>Data availability network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
									layout={EntityLayout.Value}
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
							chainConfigUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const chainConfigUrl = entity.chainConfigUrl}
					{#if chainConfigUrl != null}
						<div>
							<dt>Chain config URL</dt>
							<dd>
								<a
									href={chainConfigUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={chainConfigUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							derivationSpecUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const derivationSpecUrl = entity.derivationSpecUrl}
					{#if derivationSpecUrl != null}
						<div>
							<dt>Derivation spec URL</dt>
							<dd>
								<a
									href={derivationSpecUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={derivationSpecUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							publicRpcUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const publicRpcUrl = entity.publicRpcUrl}
					{#if publicRpcUrl != null}
						<div>
							<dt>Public RPC URL</dt>
							<dd>
								<a
									href={publicRpcUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={publicRpcUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sequencerRpcUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sequencerRpcUrl = entity.sequencerRpcUrl}
					{#if sequencerRpcUrl != null}
						<div>
							<dt>Sequencer RPC URL</dt>
							<dd>
								<a
									href={sequencerRpcUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={sequencerRpcUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
