<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoOutput>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.UtxoOutput>>
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

	const utxoOutput = $derived(selection({
		fields: {
			$address: true,
			isSpent: true,
			valueSats: true,
			scriptPubKeyType: true,
			isConfidential: true,
			scriptPubKeyAsm: true,
			scriptPubKeyHex: true,
			assetCommitment: true,
			valueCommitment: true,
			nonceCommitment: true,
			surjectionProof: true,
			rangeProof: true,
			$bitcoinCashCashTokenFungibleAmount: true,
			$bitcoinCashCashTokenNft: true,
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') ? 'Output #' + String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') : '') || 'UTXO output')
	const viewDomId = $derived('utxo-output-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BitcoinCashCashTokenFungibleAmountView from '$/views/BitcoinCashCashTokenFungibleAmountView.svelte'
	import BitcoinCashCashTokenNftView from '$/views/BitcoinCashCashTokenNftView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoOutput}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2)].slug),
			txId: String(({ ...selection.entitySelector, ...prefetched }).$transaction.txId),
			outputIndex: String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Output </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.UtxoAddress, false>('$address')}
			>
				{#snippet children(utxoAddress)}
					{#if utxoAddress != null}
						<span data-text="muted">
							<UtxoAddressView
								selection={select(EntityType.UtxoAddress, utxoAddress.entitySelector)}
								prefetched={utxoAddress}
								href={
									resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]', {
										networkSlug: String(utxoAddress.entitySelector.$network.slug),
										address: String(utxoAddress.entitySelector.address),
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
			{@const isSpent1 = prefetched.isSpent}
			{#if isSpent1 !== undefined && isSpent1 !== null}
				<span data-text="muted">
					{String((isSpent1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={utxoOutput}>
				{#snippet Pending()}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.UtxoAddress, false>('$address')}
					>
						{#snippet children(utxoAddress)}
							{#if utxoAddress != null}
								<span data-text="muted">
									<UtxoAddressView
										selection={select(EntityType.UtxoAddress, utxoAddress.entitySelector)}
										prefetched={utxoAddress}
										href={
											resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]', {
												networkSlug: String(utxoAddress.entitySelector.$network.slug),
												address: String(utxoAddress.entitySelector.address),
											})
										}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
					{@const isSpent1 = prefetched.isSpent}
					{#if isSpent1 !== undefined && isSpent1 !== null}
						<span data-text="muted">
							{String((isSpent1) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.UtxoAddress, false>('$address')}
					>
						{#snippet children(utxoAddress)}
							{#if utxoAddress != null}
								<span data-text="muted">
									<UtxoAddressView
										selection={select(EntityType.UtxoAddress, utxoAddress.entitySelector)}
										prefetched={utxoAddress}
										href={
											resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]', {
												networkSlug: String(utxoAddress.entitySelector.$network.slug),
												address: String(utxoAddress.entitySelector.address),
											})
										}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
					{@const isSpent1 = entity.isSpent}
					{#if isSpent1 !== undefined && isSpent1 !== null}
						<span data-text="muted">
							{String((isSpent1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in transaction</dt>
				<dd>
					<ResourceBoundary resource={utxoOutput}>
						{#snippet Pending()}
							{@const indexInTransaction = prefetched.indexInTransaction ?? selection.entitySelector.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue value={Number(indexInTransaction)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const indexInTransaction = entity.indexInTransaction ?? selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue value={Number(indexInTransaction)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={utxoOutput}>
				{#snippet Pending()}
					{@const valueSats = prefetched.valueSats ?? selection.entitySelector.valueSats}
					{#if valueSats !== undefined && valueSats !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue value={Number(valueSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const valueSats = entity.valueSats ?? selection.entitySelector.valueSats ?? prefetched.valueSats}
					{#if valueSats !== undefined && valueSats !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue value={Number(valueSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoOutput}>
				{#snippet Pending()}
					{@const scriptPubKeyType = prefetched.scriptPubKeyType ?? selection.entitySelector.scriptPubKeyType}
					{#if scriptPubKeyType !== undefined && scriptPubKeyType !== null}
						<div>
							<dt>Script pub key type</dt>
							<dd>
								{String((scriptPubKeyType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const scriptPubKeyType = entity.scriptPubKeyType ?? selection.entitySelector.scriptPubKeyType ?? prefetched.scriptPubKeyType}
					{#if scriptPubKeyType !== undefined && scriptPubKeyType !== null}
						<div>
							<dt>Script pub key type</dt>
							<dd>
								{String((scriptPubKeyType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoOutput}>
				{#snippet Pending()}
					{@const isConfidential = prefetched.isConfidential ?? selection.entitySelector.isConfidential}
					{#if isConfidential !== undefined && isConfidential !== null}
						<div>
							<dt>Confidential</dt>
							<dd>
								{String((isConfidential) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const isConfidential = entity.isConfidential ?? selection.entitySelector.isConfidential ?? prefetched.isConfidential}
					{#if isConfidential !== undefined && isConfidential !== null}
						<div>
							<dt>Confidential</dt>
							<dd>
								{String((isConfidential) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={utxoOutput}>
				{#snippet Pending()}
					{@const scriptPubKeyAsm = prefetched.scriptPubKeyAsm ?? selection.entitySelector.scriptPubKeyAsm}
					{#if scriptPubKeyAsm !== undefined && scriptPubKeyAsm !== null}
						<div>
							<dt>Script pub key asm</dt>
							<dd>
								{String((scriptPubKeyAsm) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const scriptPubKeyAsm = entity.scriptPubKeyAsm ?? selection.entitySelector.scriptPubKeyAsm ?? prefetched.scriptPubKeyAsm}
					{#if scriptPubKeyAsm !== undefined && scriptPubKeyAsm !== null}
						<div>
							<dt>Script pub key asm</dt>
							<dd>
								{String((scriptPubKeyAsm) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoOutput}>
				{#snippet Pending()}
					{@const scriptPubKeyHex = prefetched.scriptPubKeyHex ?? selection.entitySelector.scriptPubKeyHex}
					{#if scriptPubKeyHex !== undefined && scriptPubKeyHex !== null}
						<div>
							<dt>Script pub key hex</dt>
							<dd>
								{String((scriptPubKeyHex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const scriptPubKeyHex = entity.scriptPubKeyHex ?? selection.entitySelector.scriptPubKeyHex ?? prefetched.scriptPubKeyHex}
					{#if scriptPubKeyHex !== undefined && scriptPubKeyHex !== null}
						<div>
							<dt>Script pub key hex</dt>
							<dd>
								{String((scriptPubKeyHex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoOutput}>
				{#snippet Pending()}
					{@const assetCommitment = prefetched.assetCommitment ?? selection.entitySelector.assetCommitment}
					{#if assetCommitment !== undefined && assetCommitment !== null}
						<div>
							<dt>Asset commitment</dt>
							<dd>
								{String((assetCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const assetCommitment = entity.assetCommitment ?? selection.entitySelector.assetCommitment ?? prefetched.assetCommitment}
					{#if assetCommitment !== undefined && assetCommitment !== null}
						<div>
							<dt>Asset commitment</dt>
							<dd>
								{String((assetCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoOutput}>
				{#snippet Pending()}
					{@const valueCommitment = prefetched.valueCommitment ?? selection.entitySelector.valueCommitment}
					{#if valueCommitment !== undefined && valueCommitment !== null}
						<div>
							<dt>Value commitment</dt>
							<dd>
								{String((valueCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const valueCommitment = entity.valueCommitment ?? selection.entitySelector.valueCommitment ?? prefetched.valueCommitment}
					{#if valueCommitment !== undefined && valueCommitment !== null}
						<div>
							<dt>Value commitment</dt>
							<dd>
								{String((valueCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoOutput}>
				{#snippet Pending()}
					{@const nonceCommitment = prefetched.nonceCommitment ?? selection.entitySelector.nonceCommitment}
					{#if nonceCommitment !== undefined && nonceCommitment !== null}
						<div>
							<dt>Nonce commitment</dt>
							<dd>
								{String((nonceCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const nonceCommitment = entity.nonceCommitment ?? selection.entitySelector.nonceCommitment ?? prefetched.nonceCommitment}
					{#if nonceCommitment !== undefined && nonceCommitment !== null}
						<div>
							<dt>Nonce commitment</dt>
							<dd>
								{String((nonceCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={utxoOutput}>
				{#snippet Pending()}
					{@const surjectionProof = prefetched.surjectionProof ?? selection.entitySelector.surjectionProof}
					{#if surjectionProof !== undefined && surjectionProof !== null}
						<div>
							<dt>Surjection proof</dt>
							<dd>
								{String((surjectionProof) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const surjectionProof = entity.surjectionProof ?? selection.entitySelector.surjectionProof ?? prefetched.surjectionProof}
					{#if surjectionProof !== undefined && surjectionProof !== null}
						<div>
							<dt>Surjection proof</dt>
							<dd>
								{String((surjectionProof) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoOutput}>
				{#snippet Pending()}
					{@const rangeProof = prefetched.rangeProof ?? selection.entitySelector.rangeProof}
					{#if rangeProof !== undefined && rangeProof !== null}
						<div>
							<dt>Range proof</dt>
							<dd>
								{String((rangeProof) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const rangeProof = entity.rangeProof ?? selection.entitySelector.rangeProof ?? prefetched.rangeProof}
					{#if rangeProof !== undefined && rangeProof !== null}
						<div>
							<dt>Range proof</dt>
							<dd>
								{String((rangeProof) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BitcoinCashCashTokenFungibleAmount, false>('$bitcoinCashCashTokenFungibleAmount')}
			>
				{#snippet children(bitcoinCashCashTokenFungibleAmount)}
					{#if bitcoinCashCashTokenFungibleAmount != null}
						<div>
							<dt>Bitcoin Cash CashToken fungible amount</dt>
							<dd>
								<BitcoinCashCashTokenFungibleAmountView
									selection={select(EntityType.BitcoinCashCashTokenFungibleAmount, bitcoinCashCashTokenFungibleAmount.entitySelector)}
									prefetched={bitcoinCashCashTokenFungibleAmount}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/fungible-amount', {
											networkSlug: String(networkByCaip2[String(bitcoinCashCashTokenFungibleAmount.entitySelector.$output.$transaction.$network.caip2)].slug),
											txId: String(bitcoinCashCashTokenFungibleAmount.entitySelector.$output.$transaction.txId),
											outputIndex: String(bitcoinCashCashTokenFungibleAmount.entitySelector.$output.indexInTransaction),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BitcoinCashCashTokenNft, false>('$bitcoinCashCashTokenNft')}
			>
				{#snippet children(bitcoinCashCashTokenNft)}
					{#if bitcoinCashCashTokenNft != null}
						<div>
							<dt>Bitcoin Cash CashToken NFT</dt>
							<dd>
								<BitcoinCashCashTokenNftView
									selection={select(EntityType.BitcoinCashCashTokenNft, bitcoinCashCashTokenNft.entitySelector)}
									prefetched={bitcoinCashCashTokenNft}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft', {
											networkSlug: String(networkByCaip2[String(bitcoinCashCashTokenNft.entitySelector.$output.$transaction.$network.caip2)].slug),
											txId: String(bitcoinCashCashTokenNft.entitySelector.$output.$transaction.txId),
											outputIndex: String(bitcoinCashCashTokenNft.entitySelector.$output.indexInTransaction),
										})
									}
									layout={EntityLayout.Title}
									open={false}
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
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]', {
								networkSlug: String(selection.entitySelector.$transaction.$network.slug),
								txId: String(selection.entitySelector.$transaction.txId),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
