<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.UtxoOutput>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const utxoOutput = $derived(selection({
		fields: {
			isSpent: true,
			isConfidential: true,
		},
	}))


	// Components
	import IconComponent from '$/components/Icon.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BitcoinOrdinalInscriptionsView from '$/views/BitcoinOrdinalInscriptionsView.svelte'
	import BitcoinRuneBalancesView from '$/views/BitcoinRuneBalancesView.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
	import BitcoinCashCashTokenFungibleAmountView from '$/views/BitcoinCashCashTokenFungibleAmountView.svelte'
	import BitcoinCashCashTokenNftView from '$/views/BitcoinCashCashTokenNftView.svelte'
	import BitcoinRunestoneView from '$/views/BitcoinRunestoneView.svelte'
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
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]',
				{
					network: (
						transaction.$network.caip2 !== undefined ?
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
	{#snippet Icon()}
		<IconComponent />
	{/snippet}

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
				{@const isConfidential = entity.isConfidential}
				{#if isConfidential != null}
					<span data-text="muted">
						{isConfidential ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
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
				resource={utxoOutput}
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
				resource={selection.$bitcoinCashCashTokenFungibleAmount}
			>
				{#snippet children(bitcoinCashCashTokenFungibleAmount)}
					{#if bitcoinCashCashTokenFungibleAmount != null}
						{@const bitcoinCashCashTokenFungibleAmountInitial = untrack(() => bitcoinCashCashTokenFungibleAmount)}
						<div>
							<dt>Bitcoin Cash CashToken fungible amount</dt>
							<dd>
								<BitcoinCashCashTokenFungibleAmountView
									selection={select(EntityType.BitcoinCashCashTokenFungibleAmount, (bitcoinCashCashTokenFungibleAmount ?? bitcoinCashCashTokenFungibleAmountInitial)[EntityMetaKey.Selector])}
									prefetched={bitcoinCashCashTokenFungibleAmount ?? bitcoinCashCashTokenFungibleAmountInitial}
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
						{@const bitcoinCashCashTokenNftInitial = untrack(() => bitcoinCashCashTokenNft)}
						<div>
							<dt>Bitcoin Cash CashToken NFT</dt>
							<dd>
								<BitcoinCashCashTokenNftView
									selection={select(EntityType.BitcoinCashCashTokenNft, (bitcoinCashCashTokenNft ?? bitcoinCashCashTokenNftInitial)[EntityMetaKey.Selector])}
									prefetched={bitcoinCashCashTokenNft ?? bitcoinCashCashTokenNftInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$bitcoinRunestone}
			>
				{#snippet children(bitcoinRunestone)}
					{#if bitcoinRunestone != null}
						<div>
							<dt>Bitcoin runestone</dt>
							<dd>
								<BitcoinRunestoneView
									selection={select(EntityType.BitcoinRunestone, bitcoinRunestone[EntityMetaKey.Selector])}
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

		<ProjectionBoundary
			resource={selection.Confidential}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.assetCommitment}
					>
						{#snippet children(assetCommitment)}
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
						resource={projection.valueCommitment}
					>
						{#snippet children(valueCommitment)}
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
						resource={projection.nonceCommitment}
					>
						{#snippet children(nonceCommitment)}
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
						resource={projection.surjectionProof}
					>
						{#snippet children(surjectionProof)}
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
						resource={projection.rangeProof}
					>
						{#snippet children(rangeProof)}
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
				</dl>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}

	{#snippet Details()}
		{@const bitcoinOrdinalInscriptionsResource = selection.$$bitcoinOrdinalInscriptions}
		<ResourceBoundary
			resource={bitcoinOrdinalInscriptionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BitcoinOrdinalInscriptionsView
						selection={bitcoinOrdinalInscriptionsResource}
						countResource={bitcoinOrdinalInscriptionsResource.count}
						title='Ordinal inscriptions'
						id='bitcoin-ordinal-inscriptions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const bitcoinRuneBalancesResource = selection.$$bitcoinRuneBalances}
		<ResourceBoundary
			resource={bitcoinRuneBalancesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BitcoinRuneBalancesView
						selection={bitcoinRuneBalancesResource}
						countResource={bitcoinRuneBalancesResource.count}
						title='Rune balances'
						id='bitcoin-rune-balances'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
