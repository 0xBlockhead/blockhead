<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.UtxoOutput> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const utxoOutput = $derived(selection({
		fields: {
			isSpent: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
	import BitcoinCashCashTokenFungibleAmountView from '$/views/BitcoinCashCashTokenFungibleAmountView.svelte'
	import BitcoinCashCashTokenNftView from '$/views/BitcoinCashCashTokenNftView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoOutput}
	entitySelector={selection.entitySelector}
	title={title ?? `Output #${selection.entitySelector.indexInTransaction}`}
	idDragPlainText={String(selection.entitySelector.indexInTransaction)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/output/[outputIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$network ?
							caip2StringFromValue(transaction.$network.caip2)
						:
							transaction.$network.slug
					),
					transactionId: transaction.txId,
					outputIndex: String(selection.entitySelector.indexInTransaction),
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
		<span data-row="inline align-center gap-2 wrap">
			<span>Output </span>
			<span data-badge="small">
				#{selection.entitySelector.indexInTransaction}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.indexInTransaction}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={utxoOutput}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$address}
				>
					{#snippet children(utxoAddress)}
						{#if utxoAddress != null}
							<span data-text="muted">
								<UtxoAddressView
									selection={select(EntityType.UtxoAddress, utxoAddress[EntityMetaKey.Selector])}
									prefetched={utxoAddress}
									layout={EntityLayout.Title}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const isSpent = entity.isSpent}
				{#if isSpent != null}
					<span data-text="muted">
						{isSpent ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in transaction</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.indexInTransaction}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valueSats = entity.valueSats}
					{#if valueSats != null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue
									value={valueSats}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$address}
			>
				{#snippet children(utxoAddress)}
					{#if utxoAddress != null}
						<div>
							<dt>Address</dt>
							<dd>
								<UtxoAddressView
									selection={select(EntityType.UtxoAddress, utxoAddress[EntityMetaKey.Selector])}
									prefetched={utxoAddress}
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
							scriptPubKeyType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const scriptPubKeyType = entity.scriptPubKeyType}
					{#if scriptPubKeyType != null}
						<div>
							<dt>Script pub key type</dt>
							<dd>
								{scriptPubKeyType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={utxoOutput}
			>
				{#snippet children(entity)}
					{@const isSpent = entity.isSpent}
					{#if isSpent != null}
						<div>
							<dt>Spent</dt>
							<dd>
								{isSpent ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isConfidential: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isConfidential = entity.isConfidential}
					{#if isConfidential != null}
						<div>
							<dt>Confidential</dt>
							<dd>
								{isConfidential ? 'Yes' : 'No'}
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
							scriptPubKeyAsm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const scriptPubKeyAsm = entity.scriptPubKeyAsm}
					{#if scriptPubKeyAsm != null}
						<div>
							<dt>Script pub key asm</dt>
							<dd>
								{scriptPubKeyAsm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							scriptPubKeyHex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const scriptPubKeyHex = entity.scriptPubKeyHex}
					{#if scriptPubKeyHex != null}
						<div>
							<dt>Script pub key hex</dt>
							<dd>
								{scriptPubKeyHex}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetCommitment: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetCommitment = entity.assetCommitment}
					{#if assetCommitment != null}
						<div>
							<dt>Asset commitment</dt>
							<dd>
								{assetCommitment}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueCommitment: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valueCommitment = entity.valueCommitment}
					{#if valueCommitment != null}
						<div>
							<dt>Value commitment</dt>
							<dd>
								{valueCommitment}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nonceCommitment: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nonceCommitment = entity.nonceCommitment}
					{#if nonceCommitment != null}
						<div>
							<dt>Nonce commitment</dt>
							<dd>
								{nonceCommitment}
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
							surjectionProof: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const surjectionProof = entity.surjectionProof}
					{#if surjectionProof != null}
						<div>
							<dt>Surjection proof</dt>
							<dd>
								{surjectionProof}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rangeProof: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rangeProof = entity.rangeProof}
					{#if rangeProof != null}
						<div>
							<dt>Range proof</dt>
							<dd>
								{rangeProof}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$bitcoinCashCashTokenFungibleAmount}
			>
				{#snippet children(bitcoinCashCashTokenFungibleAmount)}
					{#if bitcoinCashCashTokenFungibleAmount != null}
						<div>
							<dt>Bitcoin Cash CashToken fungible amount</dt>
							<dd>
								<BitcoinCashCashTokenFungibleAmountView
									selection={select(EntityType.BitcoinCashCashTokenFungibleAmount, bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector])}
									prefetched={bitcoinCashCashTokenFungibleAmount}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$bitcoinCashCashTokenNft}
			>
				{#snippet children(bitcoinCashCashTokenNft)}
					{#if bitcoinCashCashTokenNft != null}
						<div>
							<dt>Bitcoin Cash CashToken NFT</dt>
							<dd>
								<BitcoinCashCashTokenNftView
									selection={select(EntityType.BitcoinCashCashTokenNft, bitcoinCashCashTokenNft[EntityMetaKey.Selector])}
									prefetched={bitcoinCashCashTokenNft}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Transaction</dt>
				<dd>
					<UtxoTransactionView
						selection={select(EntityType.UtxoTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
