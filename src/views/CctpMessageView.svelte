<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CctpMessage>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.CircleCctpContracts_Evm,
			Source.CircleCctpContracts_Solana,
			Source.CircleCctpContracts_Stellar,
			Source.CircleCctpIris,
		],
	}))
	const cctpMessage = $derived(viewSelection({
		fields: {
			messageHash: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CctpAttestation_TimestampsView from '$/views/CctpAttestation_TimestampsView.svelte'
	import CctpDomainSupportView from '$/views/CctpDomainSupportView.svelte'
</script>


<EntityView
	entityType={EntityType.CctpMessage}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.nonce || 'CCTP message')}
	href={
		href === undefined ?
			resolve(
				'/cctp/message/[sourceDomain=nonNegativeInteger]/[nonce=stringSegment]',
				{
					sourceDomain: String(selection.entitySelector.sourceDomain),
					nonce: selection.entitySelector.nonce,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{String(selection.entitySelector.sourceDomain)}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cctpMessage}>
			{#snippet children(entity)}
				{@const messageHash = entity.messageHash}
				{#if messageHash != null}
					<span data-text="muted">
						<TruncatedValue value={messageHash} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Source domain</dt>
				<dd>
					{selection.entitySelector.sourceDomain}
				</dd>
			</div>

			<div>
				<dt>Nonce</dt>
				<dd>
					{selection.entitySelector.nonce}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cctpVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cctpVersion = entity.cctpVersion}
					{#if cctpVersion != null}
						<div>
							<dt>CCTP version</dt>
							<dd>
								{cctpVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cctpMessage}
			>
				{#snippet children(entity)}
					{@const messageHash = entity.messageHash}
					{#if messageHash != null}
						<div>
							<dt>Message hash</dt>
							<dd>
								<TruncatedValue value={messageHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							messageBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const messageBytes = entity.messageBytes}
					{#if messageBytes != null}
						<div>
							<dt>Message bytes</dt>
							<dd>
								{messageBytes}
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
							sourceTransactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceTransactionHash = entity.sourceTransactionHash}
					{#if sourceTransactionHash != null}
						<div>
							<dt>Source transaction hash</dt>
							<dd>
								<TruncatedValue value={sourceTransactionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourceLogIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceLogIndex = entity.sourceLogIndex}
					{#if sourceLogIndex != null}
						<div>
							<dt>Source log index</dt>
							<dd>
								{sourceLogIndex}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$sourceDomain}
			>
				{#snippet children(cctpDomainSupport)}
					{#if cctpDomainSupport != null}
						{@const cctpDomainSupportInitial = untrack(() => cctpDomainSupport)}
						<div>
							<dt>Source domain</dt>
							<dd>
								<CctpDomainSupportView
									selection={select(EntityType.CctpDomainSupport, (cctpDomainSupport ?? cctpDomainSupportInitial)[EntityMetaKey.Selector])}
									prefetched={cctpDomainSupport ?? cctpDomainSupportInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$destinationDomain}
			>
				{#snippet children(cctpDomainSupport)}
					{#if cctpDomainSupport != null}
						{@const cctpDomainSupportInitial = untrack(() => cctpDomainSupport)}
						<div>
							<dt>Destination domain</dt>
							<dd>
								<CctpDomainSupportView
									selection={select(EntityType.CctpDomainSupport, (cctpDomainSupport ?? cctpDomainSupportInitial)[EntityMetaKey.Selector])}
									prefetched={cctpDomainSupport ?? cctpDomainSupportInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							destinationDomain: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const destinationDomain = entity.destinationDomain}
					{#if destinationDomain != null}
						<div>
							<dt>Destination domain</dt>
							<dd>
								{destinationDomain}
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
							sender: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sender = entity.sender}
					{#if sender != null}
						<div>
							<dt>Sender</dt>
							<dd>
								{sender}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							recipient: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const recipient = entity.recipient}
					{#if recipient != null}
						<div>
							<dt>Recipient</dt>
							<dd>
								{recipient}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							destinationCaller: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const destinationCaller = entity.destinationCaller}
					{#if destinationCaller != null}
						<div>
							<dt>Destination caller</dt>
							<dd>
								{destinationCaller}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							burnToken: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const burnToken = entity.burnToken}
					{#if burnToken != null}
						<div>
							<dt>Burn token</dt>
							<dd>
								{burnToken}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							mintRecipient: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mintRecipient = entity.mintRecipient}
					{#if mintRecipient != null}
						<div>
							<dt>Mint recipient</dt>
							<dd>
								{mintRecipient}
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
							amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
						<div>
							<dt>Amount</dt>
							<dd>
								<NumberValue
									value={amount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							messageSender: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const messageSender = entity.messageSender}
					{#if messageSender != null}
						<div>
							<dt>Message sender</dt>
							<dd>
								{messageSender}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							maxFee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxFee = entity.maxFee}
					{#if maxFee != null}
						<div>
							<dt>Max fee</dt>
							<dd>
								<NumberValue
									value={maxFee}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							feeExecuted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeExecuted = entity.feeExecuted}
					{#if feeExecuted != null}
						<div>
							<dt>Fee executed</dt>
							<dd>
								<NumberValue
									value={feeExecuted}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expirationBlock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expirationBlock = entity.expirationBlock}
					{#if expirationBlock != null}
						<div>
							<dt>Expiration block</dt>
							<dd>
								<NumberValue
									value={expirationBlock}
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
							hookData: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hookData = entity.hookData}
					{#if hookData != null}
						<div>
							<dt>Hook data</dt>
							<dd>
								{hookData}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							minFinalityThreshold: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const minFinalityThreshold = entity.minFinalityThreshold}
					{#if minFinalityThreshold != null}
						<div>
							<dt>Minimum finality threshold</dt>
							<dd>
								{minFinalityThreshold}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							finalityThresholdExecuted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const finalityThresholdExecuted = entity.finalityThresholdExecuted}
					{#if finalityThresholdExecuted != null}
						<div>
							<dt>Finality threshold executed</dt>
							<dd>
								{finalityThresholdExecuted}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const attestationTimestampsResource = selection.$$attestationTimestamps}
		<ResourceBoundary
			resource={attestationTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CctpAttestation_TimestampsView
						selection={attestationTimestampsResource}
						countResource={attestationTimestampsResource.count}
						title='Attestation timestamps'
						id='attestation-timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
