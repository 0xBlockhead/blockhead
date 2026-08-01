<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadPayjoinSession>, 'prefetched'> = $props()

	const blockheadPayjoinSession = $derived(selection({
		fields: {
			status: true,
			role: true,
			amountSats: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.sessionId || 'blockhead payjoin session')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadPayjoinSession}>
			{#snippet children(entity)}
				{[entity.status, entity.role].filter(Boolean).join(' ') || selection.entitySelector.sessionId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadPayjoinSession}>
			{#snippet children(entity)}
				{@const amountSats = entity.amountSats}
				{#if amountSats != null}
					<span data-text="muted">
						<NumberValue
							value={amountSats}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>session ID</dt>
				<dd>
					{selection.entitySelector.sessionId}
				</dd>
			</div>

			<div>
				<dt>role</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadPayjoinSession}
					>
						{#snippet children(entity)}
							{entity.role}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadPayjoinSession}
					>
						{#snippet children(entity)}
							{entity.status}
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
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
							/>
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
					{#if payjoinDirectory != null}
						<div>
							<dt>directory</dt>
							<dd>
								<PayjoinDirectoryView
									selection={select(EntityType.PayjoinDirectory, payjoinDirectory[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
					{#if payjoinEndpoint != null}
						<div>
							<dt>endpoint</dt>
							<dd>
								<PayjoinEndpointView
									selection={select(EntityType.PayjoinEndpoint, payjoinEndpoint[EntityMetaKey.Selector])}
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
							endpointUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const endpointUrl = entity.endpointUrl}
					{#if endpointUrl != null}
						<div>
							<dt>endpoint URL</dt>
							<dd>
								<a
									href={endpointUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={endpointUrl} />
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
							bip21Uri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bip21Uri = entity.bip21Uri}
					{#if bip21Uri != null}
						<div>
							<dt>bip21 URI</dt>
							<dd>
								<a
									href={bip21Uri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={bip21Uri} />
								</a>
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
							receiverAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const receiverAddress = entity.receiverAddress}
					{#if receiverAddress != null}
						<div>
							<dt>receiver address</dt>
							<dd>
								<TruncatedValue value={receiverAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadPayjoinSession}
			>
				{#snippet children(entity)}
					{@const amountSats = entity.amountSats}
					{#if amountSats != null}
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
						fields: {
							disableOutputSubstitution: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const disableOutputSubstitution = entity.disableOutputSubstitution}
					{#if disableOutputSubstitution != null}
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
						fields: {
							minFeeRateSatPerVbyte: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const minFeeRateSatPerVbyte = entity.minFeeRateSatPerVbyte}
					{#if minFeeRateSatPerVbyte != null}
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
						fields: {
							additionalFeeOutputIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const additionalFeeOutputIndex = entity.additionalFeeOutputIndex}
					{#if additionalFeeOutputIndex != null}
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
						fields: {
							maxAdditionalFeeContributionSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxAdditionalFeeContributionSats = entity.maxAdditionalFeeContributionSats}
					{#if maxAdditionalFeeContributionSats != null}
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
						fields: {
							originalPsbtHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const originalPsbtHash = entity.originalPsbtHash}
					{#if originalPsbtHash != null}
						<div>
							<dt>original psbt hash</dt>
							<dd>
								<TruncatedValue value={originalPsbtHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proposalPsbtHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proposalPsbtHash = entity.proposalPsbtHash}
					{#if proposalPsbtHash != null}
						<div>
							<dt>proposal psbt hash</dt>
							<dd>
								<TruncatedValue value={proposalPsbtHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							finalTransactionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const finalTransactionId = entity.finalTransactionId}
					{#if finalTransactionId != null}
						<div>
							<dt>final transaction ID</dt>
							<dd>
								<TruncatedValue value={finalTransactionId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$finalTransaction}
			>
				{#snippet children(utxoTransaction)}
					{#if utxoTransaction != null}
						<div>
							<dt>final transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, utxoTransaction[EntityMetaKey.Selector])}
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
							errorCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const errorCode = entity.errorCode}
					{#if errorCode != null}
						<div>
							<dt>error code</dt>
							<dd>
								{errorCode}
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
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							updatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const updatedAt = entity.updatedAt}
					{#if updatedAt != null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={updatedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const completedAt = entity.completedAt}
					{#if completedAt != null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={completedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
