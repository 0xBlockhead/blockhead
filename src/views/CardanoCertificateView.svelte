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
	}: EntitySelectionViewProps<EntityType.CardanoCertificate> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const cardanoCertificate = $derived(selection({
		fields: {
			certificateKind: true,
		},
	}))
	const titleFallback = $derived([(prefetched.certificateKind ?? ''), 'Certificate #' + String(selection.entitySelector.certificateIndex)].filter(Boolean).join(' ') || 'Cardano certificate')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import CardanoStakeCredentialView from '$/views/CardanoStakeCredentialView.svelte'
	import CardanoStakePoolView from '$/views/CardanoStakePoolView.svelte'
	import CardanoDRepView from '$/views/CardanoDRepView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoCertificate}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/certificate/[certificateIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$network ?
							caip2StringFromValue(transaction.$network.caip2)
						:
							transaction.$network.slug
					),
					transactionId: transaction.hash,
					certificateIndex: String(selection.entitySelector.certificateIndex),
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
		<ResourceBoundary resource={cardanoCertificate}>
			{#snippet children(entity)}
				{[entity.certificateKind, 'Certificate #' + String(selection.entitySelector.certificateIndex)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<CardanoTransactionView
						selection={select(EntityType.CardanoTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>certificate index</dt>
				<dd>
					{selection.entitySelector.certificateIndex}
				</dd>
			</div>

			<div>
				<dt>certificate kind</dt>
				<dd>
					<ResourceBoundary
						resource={cardanoCertificate}
					>
						{#snippet children(entity)}
							{entity.certificateKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$stakeCredential}
			>
				{#snippet children(cardanoStakeCredential)}
					{#if cardanoStakeCredential != null}
						{@const cardanoStakeCredentialInitial = untrack(() => cardanoStakeCredential)}
						<div>
							<dt>stake credential</dt>
							<dd>
								<CardanoStakeCredentialView
									selection={select(EntityType.CardanoStakeCredential, (cardanoStakeCredential ?? cardanoStakeCredentialInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$stakePool}
			>
				{#snippet children(cardanoStakePool)}
					{#if cardanoStakePool != null}
						{@const cardanoStakePoolInitial = untrack(() => cardanoStakePool)}
						<div>
							<dt>stake pool</dt>
							<dd>
								<CardanoStakePoolView
									selection={select(EntityType.CardanoStakePool, (cardanoStakePool ?? cardanoStakePoolInitial)[EntityMetaKey.Selector])}
									prefetched={cardanoStakePool ?? cardanoStakePoolInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$drep}
			>
				{#snippet children(cardanoDRep)}
					{#if cardanoDRep != null}
						{@const cardanoDRepInitial = untrack(() => cardanoDRep)}
						<div>
							<dt>drep</dt>
							<dd>
								<CardanoDRepView
									selection={select(EntityType.CardanoDRep, (cardanoDRep ?? cardanoDRepInitial)[EntityMetaKey.Selector])}
									prefetched={cardanoDRep ?? cardanoDRepInitial}
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
							poolId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const poolId = entity.poolId}
					{#if poolId != null}
						<div>
							<dt>pool ID</dt>
							<dd>
								{poolId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rewardAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rewardAddress = entity.rewardAddress}
					{#if rewardAddress != null}
						<div>
							<dt>reward address</dt>
							<dd>
								<TruncatedValue value={rewardAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							depositLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const depositLovelace = entity.depositLovelace}
					{#if depositLovelace != null}
						<div>
							<dt>deposit lovelace</dt>
							<dd>
								{depositLovelace}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							epoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epoch = entity.epoch}
					{#if epoch != null}
						<div>
							<dt>epoch</dt>
							<dd>
								{epoch}
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
							metadataUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metadataUrl = entity.metadataUrl}
					{#if metadataUrl != null}
						<div>
							<dt>metadata URL</dt>
							<dd>
								<a
									href={metadataUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={metadataUrl} />
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
							metadataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metadataHash = entity.metadataHash}
					{#if metadataHash != null}
						<div>
							<dt>metadata hash</dt>
							<dd>
								<TruncatedValue value={metadataHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
