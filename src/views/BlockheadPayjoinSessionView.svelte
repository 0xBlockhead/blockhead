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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadPayjoinSession>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadPayjoinSession>>
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
	const blockheadPayjoinSession = $derived(selection({
		sources: selection.sources,
		fields: {
			status: true,
			role: true,
			amountSats: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.sessionId) ?? '')].filter(Boolean).join(' ') || 'blockhead payjoin session')
	const viewDomId = $derived('blockhead-payjoin-session-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import PayjoinDirectoryView from '$/views/PayjoinDirectoryView.svelte'
	import PayjoinEndpointView from '$/views/PayjoinEndpointView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadPayjoinSession}
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
			{[String((pendingEntity.sessionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadPayjoinSession}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.sessionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.status) ?? ''), String((pendingEntity.role) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.sessionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadPayjoinSession}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.status) ?? ''), String((resolvedEntity.role) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.sessionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const amountSats0 = pendingEntity.amountSats}
			{#if amountSats0 !== undefined && amountSats0 !== null}
				<span data-text="muted">
					<NumberValue
						value={amountSats0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadPayjoinSession}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountSats0 = resolvedEntity.amountSats}
					{#if amountSats0 !== undefined && amountSats0 !== null}
						<span data-text="muted">
							<NumberValue
								value={amountSats0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									sessionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sessionId = resolvedEntity.sessionId}
							{#if sessionId !== undefined && sessionId !== null}
								{String((sessionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>role</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									role: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const role = resolvedEntity.role}
							{#if role !== undefined && role !== null}
								{String((role) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									status: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							{#if network != null && network[EntityMetaKey.Selector] != null}
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
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$directory}
			>
				{#snippet children(payjoinDirectory)}
					{#if payjoinDirectory != null && payjoinDirectory[EntityMetaKey.Selector] != null}
						<div>
							<dt>directory</dt>
							<dd>
								<PayjoinDirectoryView
									selection={select(EntityType.PayjoinDirectory, payjoinDirectory[EntityMetaKey.Selector])}
									prefetched={payjoinDirectory}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$endpoint}
			>
				{#snippet children(payjoinEndpoint)}
					{#if payjoinEndpoint != null && payjoinEndpoint[EntityMetaKey.Selector] != null}
						<div>
							<dt>endpoint</dt>
							<dd>
								<PayjoinEndpointView
									selection={select(EntityType.PayjoinEndpoint, payjoinEndpoint[EntityMetaKey.Selector])}
									prefetched={payjoinEndpoint}
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
							endpointUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endpointUrl = resolvedEntity.endpointUrl}
					{#if endpointUrl !== undefined && endpointUrl !== null}
						<div>
							<dt>endpoint URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpointUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpointUrl)} />
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
							bip21Uri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bip21Uri = resolvedEntity.bip21Uri}
					{#if bip21Uri !== undefined && bip21Uri !== null}
						<div>
							<dt>bip21 URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(bip21Uri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(bip21Uri)} />
								</svelte:element>
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
							receiverAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const receiverAddress = resolvedEntity.receiverAddress}
					{#if receiverAddress !== undefined && receiverAddress !== null}
						<div>
							<dt>receiver address</dt>
							<dd>
								<TruncatedValue value={String((receiverAddress) ?? '')} />
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
							amountSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountSats = resolvedEntity.amountSats}
					{#if amountSats !== undefined && amountSats !== null}
						<div>
							<dt>amount sats</dt>
							<dd>
								<NumberValue
									value={amountSats}
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
							disableOutputSubstitution: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const disableOutputSubstitution = resolvedEntity.disableOutputSubstitution}
					{#if disableOutputSubstitution !== undefined && disableOutputSubstitution !== null}
						<div>
							<dt>disable output substitution</dt>
							<dd>
								{disableOutputSubstitution ? 'Yes' : 'No'}
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
							minFeeRateSatPerVbyte: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const minFeeRateSatPerVbyte = resolvedEntity.minFeeRateSatPerVbyte}
					{#if minFeeRateSatPerVbyte !== undefined && minFeeRateSatPerVbyte !== null}
						<div>
							<dt>min fee rate sat per vbyte</dt>
							<dd>
								<NumberValue
									value={minFeeRateSatPerVbyte}
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
							additionalFeeOutputIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const additionalFeeOutputIndex = resolvedEntity.additionalFeeOutputIndex}
					{#if additionalFeeOutputIndex !== undefined && additionalFeeOutputIndex !== null}
						<div>
							<dt>additional fee output index</dt>
							<dd>
								<NumberValue
									value={additionalFeeOutputIndex}
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
							maxAdditionalFeeContributionSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxAdditionalFeeContributionSats = resolvedEntity.maxAdditionalFeeContributionSats}
					{#if maxAdditionalFeeContributionSats !== undefined && maxAdditionalFeeContributionSats !== null}
						<div>
							<dt>max additional fee contribution sats</dt>
							<dd>
								<NumberValue
									value={maxAdditionalFeeContributionSats}
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
							originalPsbtHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const originalPsbtHash = resolvedEntity.originalPsbtHash}
					{#if originalPsbtHash !== undefined && originalPsbtHash !== null}
						<div>
							<dt>original psbt hash</dt>
							<dd>
								<TruncatedValue value={String((originalPsbtHash) ?? '')} />
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
							proposalPsbtHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proposalPsbtHash = resolvedEntity.proposalPsbtHash}
					{#if proposalPsbtHash !== undefined && proposalPsbtHash !== null}
						<div>
							<dt>proposal psbt hash</dt>
							<dd>
								<TruncatedValue value={String((proposalPsbtHash) ?? '')} />
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
							finalTransactionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalTransactionId = resolvedEntity.finalTransactionId}
					{#if finalTransactionId !== undefined && finalTransactionId !== null}
						<div>
							<dt>final transaction ID</dt>
							<dd>
								<TruncatedValue value={String((finalTransactionId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$finalTransaction}
			>
				{#snippet children(utxoTransaction)}
					{#if utxoTransaction != null && utxoTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>final transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, utxoTransaction[EntityMetaKey.Selector])}
									prefetched={utxoTransaction}
									href={
										(utxoTransaction[EntityMetaKey.Selector].txId !== undefined && utxoTransaction[EntityMetaKey.Selector].$network !== undefined && utxoTransaction[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
											transactionId: String(utxoTransaction[EntityMetaKey.Selector].txId ?? ''),
											network: String(caip2StringFromValue(utxoTransaction[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : utxoTransaction[EntityMetaKey.Selector].txId !== undefined && utxoTransaction[EntityMetaKey.Selector].$network !== undefined && utxoTransaction[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
											transactionId: String(utxoTransaction[EntityMetaKey.Selector].txId ?? ''),
											network: String(utxoTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
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
							errorCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const errorCode = resolvedEntity.errorCode}
					{#if errorCode !== undefined && errorCode !== null}
						<div>
							<dt>error code</dt>
							<dd>
								{String((errorCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
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
							updatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt = resolvedEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
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
							completedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const completedAt = resolvedEntity.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
