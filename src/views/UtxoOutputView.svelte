<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const utxoOutput = $derived(selection({
		fields: {
			$address: true,
			isSpent: true,
		},
	}))
	const titleFallback = $derived((String((selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction) ?? '') ? 'Output #' + String((selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction) ?? '') : '') || 'UTXO output')
	const viewDomId = $derived('utxo-output-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction ?? '')}
	href={
		href ?? (pendingEntity.$transaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.caip2 !== undefined && pendingEntity.$transaction.$network.caip2.namespace !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.caip2 !== undefined && pendingEntity.$transaction.$network.caip2.reference !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.txId !== undefined && pendingEntity.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$transaction.$network.caip2.namespace) + ':' + String(pendingEntity.$transaction.$network.caip2.reference))].slug ?? ''),
			txId: String(pendingEntity.$transaction.txId ?? ''),
			outputIndex: String(pendingEntity.indexInTransaction ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction}
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
		{@const serialValue = selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={utxoOutput}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.UtxoAddress, false>('$address')}
				>
					{#snippet children(utxoAddress)}
						{#if utxoAddress != null && utxoAddress[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<UtxoAddressView
									selection={select(EntityType.UtxoAddress, utxoAddress[EntityMetaKey.Selector])}
									prefetched={utxoAddress}
									href={
										(utxoAddress[EntityMetaKey.Selector].$network !== undefined && utxoAddress[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoAddress[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && utxoAddress[EntityMetaKey.Selector].$network !== undefined && utxoAddress[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoAddress[EntityMetaKey.Selector].$network.caip2.reference !== undefined && utxoAddress[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/address/[address]', {
											networkSlug: String(networkByCaip2[String(String(utxoAddress[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(utxoAddress[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											address: String(utxoAddress[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
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
						{isSpent1 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.UtxoAddress, false>('$address')}
				>
					{#snippet children(utxoAddress)}
						{#if utxoAddress != null && utxoAddress[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<UtxoAddressView
									selection={select(EntityType.UtxoAddress, utxoAddress[EntityMetaKey.Selector])}
									prefetched={utxoAddress}
									href={
										(utxoAddress[EntityMetaKey.Selector].$network !== undefined && utxoAddress[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoAddress[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && utxoAddress[EntityMetaKey.Selector].$network !== undefined && utxoAddress[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoAddress[EntityMetaKey.Selector].$network.caip2.reference !== undefined && utxoAddress[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/address/[address]', {
											networkSlug: String(networkByCaip2[String(String(utxoAddress[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(utxoAddress[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											address: String(utxoAddress[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const isSpent1 = resolvedEntity.isSpent}
				{#if isSpent1 !== undefined && isSpent1 !== null}
					<span data-text="muted">
						{isSpent1 ? 'Yes' : 'No'}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									indexInTransaction: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInTransaction = selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue value={Number(indexInTransaction)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInTransaction = resolvedEntity.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue value={Number(indexInTransaction)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
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
				{#snippet Pending()}
					{@const valueSats = prefetched.valueSats}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueSats = resolvedEntity.valueSats}
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

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.UtxoAddress, false>('$address')}
			>
				{#snippet children(utxoAddress)}
					{#if utxoAddress != null && utxoAddress[EntityMetaKey.Selector] != null}
						<div>
							<dt>Address</dt>
							<dd>
								<UtxoAddressView
									selection={select(EntityType.UtxoAddress, utxoAddress[EntityMetaKey.Selector])}
									prefetched={utxoAddress}
									href={
										(utxoAddress[EntityMetaKey.Selector].$network !== undefined && utxoAddress[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoAddress[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && utxoAddress[EntityMetaKey.Selector].$network !== undefined && utxoAddress[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoAddress[EntityMetaKey.Selector].$network.caip2.reference !== undefined && utxoAddress[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/address/[address]', {
											networkSlug: String(networkByCaip2[String(String(utxoAddress[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(utxoAddress[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											address: String(utxoAddress[EntityMetaKey.Selector].address ?? ''),
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							scriptPubKeyType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const scriptPubKeyType = prefetched.scriptPubKeyType}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const scriptPubKeyType = resolvedEntity.scriptPubKeyType}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isSpent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isSpent = prefetched.isSpent}
					{#if isSpent !== undefined && isSpent !== null}
						<div>
							<dt>Spent</dt>
							<dd>
								{isSpent ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isSpent = resolvedEntity.isSpent}
					{#if isSpent !== undefined && isSpent !== null}
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
				{#snippet Pending()}
					{@const isConfidential = prefetched.isConfidential}
					{#if isConfidential !== undefined && isConfidential !== null}
						<div>
							<dt>Confidential</dt>
							<dd>
								{isConfidential ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isConfidential = resolvedEntity.isConfidential}
					{#if isConfidential !== undefined && isConfidential !== null}
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
				{#snippet Pending()}
					{@const scriptPubKeyAsm = prefetched.scriptPubKeyAsm}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const scriptPubKeyAsm = resolvedEntity.scriptPubKeyAsm}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							scriptPubKeyHex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const scriptPubKeyHex = prefetched.scriptPubKeyHex}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const scriptPubKeyHex = resolvedEntity.scriptPubKeyHex}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetCommitment: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const assetCommitment = prefetched.assetCommitment}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetCommitment = resolvedEntity.assetCommitment}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueCommitment: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueCommitment = prefetched.valueCommitment}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueCommitment = resolvedEntity.valueCommitment}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nonceCommitment: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nonceCommitment = prefetched.nonceCommitment}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonceCommitment = resolvedEntity.nonceCommitment}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							surjectionProof: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const surjectionProof = prefetched.surjectionProof}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const surjectionProof = resolvedEntity.surjectionProof}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rangeProof: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rangeProof = prefetched.rangeProof}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rangeProof = resolvedEntity.rangeProof}
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
					{#if bitcoinCashCashTokenFungibleAmount != null && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Bitcoin Cash CashToken fungible amount</dt>
							<dd>
								<BitcoinCashCashTokenFungibleAmountView
									selection={select(EntityType.BitcoinCashCashTokenFungibleAmount, bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector])}
									prefetched={bitcoinCashCashTokenFungibleAmount}
									href={
										(bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction.$network !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction.$network.caip2 !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction.$network.caip2.namespace !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction.$network !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction.$network.caip2 !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction.$network.caip2.reference !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction.txId !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/fungible-amount', {
											networkSlug: String(networkByCaip2[String(String(bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction.$network.caip2.namespace) + ':' + String(bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction.$network.caip2.reference))].slug ?? ''),
											txId: String(bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.$transaction.txId ?? ''),
											outputIndex: String(bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector].$output.indexInTransaction ?? ''),
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

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BitcoinCashCashTokenNft, false>('$bitcoinCashCashTokenNft')}
			>
				{#snippet children(bitcoinCashCashTokenNft)}
					{#if bitcoinCashCashTokenNft != null && bitcoinCashCashTokenNft[EntityMetaKey.Selector] != null}
						<div>
							<dt>Bitcoin Cash CashToken NFT</dt>
							<dd>
								<BitcoinCashCashTokenNftView
									selection={select(EntityType.BitcoinCashCashTokenNft, bitcoinCashCashTokenNft[EntityMetaKey.Selector])}
									prefetched={bitcoinCashCashTokenNft}
									href={
										(bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction.$network !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction.$network.caip2 !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction.$network.caip2.namespace !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction.$network !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction.$network.caip2 !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction.$network.caip2.reference !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction.txId !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft', {
											networkSlug: String(networkByCaip2[String(String(bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction.$network.caip2.namespace) + ':' + String(bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction.$network.caip2.reference))].slug ?? ''),
											txId: String(bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.$transaction.txId ?? ''),
											outputIndex: String(bitcoinCashCashTokenNft[EntityMetaKey.Selector].$output.indexInTransaction ?? ''),
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

			<div>
				<dt>Transaction</dt>
				<dd>
					<UtxoTransactionView
						selection={select(EntityType.UtxoTransaction, selection.entitySelector.$transaction, {})}
						href={
							(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.namespace !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.reference !== undefined && selection.entitySelector.$transaction.txId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions/[txId]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$transaction.$network.caip2.namespace) + ':' + String(selection.entitySelector.$transaction.$network.caip2.reference))].slug ?? ''),
								txId: String(selection.entitySelector.$transaction.txId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
