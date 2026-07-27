<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CctpDomainSupport> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.CircleCctpContracts_Evm,
			Source.CircleCctpContracts_Solana,
			Source.CircleCctpContracts_Stellar,
			Source.CircleCctp_IrisApi,
		],
	}))
	const cctpDomainSupport = $derived(viewSelection({
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.name ?? '') || 'CCTP domain support')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CctpMessagesView from '$/views/CctpMessagesView.svelte'
	import CctpBurnFee_TimestampsView from '$/views/CctpBurnFee_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CctpDomainSupport}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cctpDomainSupport}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{String(pendingEntity.domainId ?? '') || (pendingEntity.name ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{String(pendingEntity.cctpVersion)}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>CCTP version</dt>
				<dd>
					{String(pendingEntity.cctpVersion)}
				</dd>
			</div>

			<div>
				<dt>Domain ID</dt>
				<dd>
					{String(pendingEntity.domainId)}
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={cctpDomainSupport}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>Network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
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
					viewSelection({
						fields: {
							standardTransferSource: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const standardTransferSource = entity.standardTransferSource}
					{#if standardTransferSource != null}
						<div>
							<dt>Standard transfer source</dt>
							<dd>
								{standardTransferSource ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fastTransferSource: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fastTransferSource = entity.fastTransferSource}
					{#if fastTransferSource != null}
						<div>
							<dt>Fast transfer source</dt>
							<dd>
								{fastTransferSource ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							forwardingDestination: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const forwardingDestination = entity.forwardingDestination}
					{#if forwardingDestination != null}
						<div>
							<dt>Forwarding destination</dt>
							<dd>
								{forwardingDestination ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Supported tokens</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									supportedTokens: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.supportedTokens.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							tokenMessengerAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenMessengerAddress = entity.tokenMessengerAddress}
					{#if tokenMessengerAddress != null}
						<div>
							<dt>Token messenger address</dt>
							<dd>
								<TruncatedValue value={tokenMessengerAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							messageTransmitterAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const messageTransmitterAddress = entity.messageTransmitterAddress}
					{#if messageTransmitterAddress != null}
						<div>
							<dt>Message transmitter address</dt>
							<dd>
								<TruncatedValue value={messageTransmitterAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							tokenMinterAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenMinterAddress = entity.tokenMinterAddress}
					{#if tokenMinterAddress != null}
						<div>
							<dt>Token minter address</dt>
							<dd>
								<TruncatedValue value={tokenMinterAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const cctpDomainSupportCctpMessagesViewMessagesResource = selection.$$messages}
		<ResourceBoundary
			resource={cctpDomainSupportCctpMessagesViewMessagesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CctpMessagesView
						selection={cctpDomainSupportCctpMessagesViewMessagesResource}
						countResource={cctpDomainSupportCctpMessagesViewMessagesResource.count}
						title='Messages'
						id='messages'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const cctpDomainSupportCctpBurnFeeTimestampsViewBurnFeeTimestampsResource = selection.$$burnFeeTimestamps}
		<ResourceBoundary
			resource={cctpDomainSupportCctpBurnFeeTimestampsViewBurnFeeTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CctpBurnFee_TimestampsView
						selection={cctpDomainSupportCctpBurnFeeTimestampsViewBurnFeeTimestampsResource}
						countResource={cctpDomainSupportCctpBurnFeeTimestampsViewBurnFeeTimestampsResource.count}
						title='Burn fee timestamps'
						id='burn-fee-timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
