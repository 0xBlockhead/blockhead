<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.CctpMessage>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CctpMessage>
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
	const cctpMessage = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			messageHash: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			messageHash: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.nonce) ?? '')].filter(Boolean).join(' ') || 'CCTP message')
	const viewDomId = $derived('cctp-message-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CctpAttestation_TimestampsView from '$/views/CctpAttestation_TimestampsView.svelte'
	import CctpDomainSupportView from '$/views/CctpDomainSupportView.svelte'
</script>


<EntityView
	entityType={EntityType.CctpMessage}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'messageHash')}
			{[String((pendingEntity.nonce) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={cctpMessage}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.nonce) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'messageHash')}
			{[String((pendingEntity.sourceDomain) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.nonce) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={cctpMessage}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.sourceDomain) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.nonce) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'messageHash')}
			{@const messageHash0 = pendingEntity.messageHash}
			{#if messageHash0 !== undefined && messageHash0 !== null}
				<span data-text="muted">
					<TruncatedValue value={String((messageHash0) ?? '')} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cctpMessage}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const messageHash0 = resolvedEntity.messageHash}
					{#if messageHash0 !== undefined && messageHash0 !== null}
						<span data-text="muted">
							<TruncatedValue value={String((messageHash0) ?? '')} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source domain</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									sourceDomain: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sourceDomain = resolvedEntity.sourceDomain}
							{#if sourceDomain !== undefined && sourceDomain !== null}
								{String((sourceDomain) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Nonce</dt>
				<dd>
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
								{String((nonce) ?? '')}
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
							cctpVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cctpVersion = resolvedEntity.cctpVersion}
					{#if cctpVersion !== undefined && cctpVersion !== null}
						<div>
							<dt>CCTP version</dt>
							<dd>
								{String((cctpVersion) ?? '')}
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
							messageHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const messageHash = resolvedEntity.messageHash}
					{#if messageHash !== undefined && messageHash !== null}
						<div>
							<dt>Message hash</dt>
							<dd>
								<TruncatedValue value={String((messageHash) ?? '')} />
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
							messageBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const messageBytes = resolvedEntity.messageBytes}
					{#if messageBytes !== undefined && messageBytes !== null}
						<div>
							<dt>Message bytes</dt>
							<dd>
								{String((messageBytes) ?? '')}
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
							sourceTransactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceTransactionHash = resolvedEntity.sourceTransactionHash}
					{#if sourceTransactionHash !== undefined && sourceTransactionHash !== null}
						<div>
							<dt>Source transaction hash</dt>
							<dd>
								<TruncatedValue value={String((sourceTransactionHash) ?? '')} />
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
							sourceLogIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceLogIndex = resolvedEntity.sourceLogIndex}
					{#if sourceLogIndex !== undefined && sourceLogIndex !== null}
						<div>
							<dt>Source log index</dt>
							<dd>
								{String((sourceLogIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$sourceDomain}
			>
				{#snippet children(cctpDomainSupport)}
					{#if cctpDomainSupport != null && cctpDomainSupport[EntityMetaKey.Selector] != null}
						<div>
							<dt>Source domain</dt>
							<dd>
								<CctpDomainSupportView
									selection={select(EntityType.CctpDomainSupport, cctpDomainSupport[EntityMetaKey.Selector])}
									prefetched={cctpDomainSupport}
									layout={EntityLayout.Value}
									open={false}
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
					{#if cctpDomainSupport != null && cctpDomainSupport[EntityMetaKey.Selector] != null}
						<div>
							<dt>Destination domain</dt>
							<dd>
								<CctpDomainSupportView
									selection={select(EntityType.CctpDomainSupport, cctpDomainSupport[EntityMetaKey.Selector])}
									prefetched={cctpDomainSupport}
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
							destinationDomain: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const destinationDomain = resolvedEntity.destinationDomain}
					{#if destinationDomain !== undefined && destinationDomain !== null}
						<div>
							<dt>Destination domain</dt>
							<dd>
								{String((destinationDomain) ?? '')}
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
							sender: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sender = resolvedEntity.sender}
					{#if sender !== undefined && sender !== null}
						<div>
							<dt>Sender</dt>
							<dd>
								{String((sender) ?? '')}
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
							recipient: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const recipient = resolvedEntity.recipient}
					{#if recipient !== undefined && recipient !== null}
						<div>
							<dt>Recipient</dt>
							<dd>
								{String((recipient) ?? '')}
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
							destinationCaller: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const destinationCaller = resolvedEntity.destinationCaller}
					{#if destinationCaller !== undefined && destinationCaller !== null}
						<div>
							<dt>Destination caller</dt>
							<dd>
								{String((destinationCaller) ?? '')}
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
							burnToken: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const burnToken = resolvedEntity.burnToken}
					{#if burnToken !== undefined && burnToken !== null}
						<div>
							<dt>Burn token</dt>
							<dd>
								{String((burnToken) ?? '')}
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
							mintRecipient: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mintRecipient = resolvedEntity.mintRecipient}
					{#if mintRecipient !== undefined && mintRecipient !== null}
						<div>
							<dt>Mint recipient</dt>
							<dd>
								{String((mintRecipient) ?? '')}
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
							amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount = resolvedEntity.amount}
					{#if amount !== undefined && amount !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							messageSender: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const messageSender = resolvedEntity.messageSender}
					{#if messageSender !== undefined && messageSender !== null}
						<div>
							<dt>Message sender</dt>
							<dd>
								{String((messageSender) ?? '')}
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
							maxFee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxFee = resolvedEntity.maxFee}
					{#if maxFee !== undefined && maxFee !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							feeExecuted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeExecuted = resolvedEntity.feeExecuted}
					{#if feeExecuted !== undefined && feeExecuted !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							expirationBlock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expirationBlock = resolvedEntity.expirationBlock}
					{#if expirationBlock !== undefined && expirationBlock !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							hookData: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hookData = resolvedEntity.hookData}
					{#if hookData !== undefined && hookData !== null}
						<div>
							<dt>Hook data</dt>
							<dd>
								{String((hookData) ?? '')}
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
							minFinalityThreshold: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const minFinalityThreshold = resolvedEntity.minFinalityThreshold}
					{#if minFinalityThreshold !== undefined && minFinalityThreshold !== null}
						<div>
							<dt>Minimum finality threshold</dt>
							<dd>
								{String((minFinalityThreshold) ?? '')}
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
							finalityThresholdExecuted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalityThresholdExecuted = resolvedEntity.finalityThresholdExecuted}
					{#if finalityThresholdExecuted !== undefined && finalityThresholdExecuted !== null}
						<div>
							<dt>Finality threshold executed</dt>
							<dd>
								{String((finalityThresholdExecuted) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const cctpMessageCctpAttestationTimestampsViewAttestationTimestampsResource = selection.$$attestationTimestamps}
		<ResourceBoundary
			resource={cctpMessageCctpAttestationTimestampsViewAttestationTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<CctpAttestation_TimestampsView
					selection={cctpMessageCctpAttestationTimestampsViewAttestationTimestampsResource}
					countResource={cctpMessageCctpAttestationTimestampsViewAttestationTimestampsResource.count}
					title='Attestation timestamps'
					id='CctpAttestation_TimestampsView-attestation-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
