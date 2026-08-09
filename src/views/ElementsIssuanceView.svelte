<!-- Generated from APP.ts. -->

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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ElementsIssuance>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const elementsIssuance = $derived(selection({
		fields: {
			isReissuance: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
	import ElementsAssetView from '$/views/ElementsAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsIssuance}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.inputIndex)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/issuance/[inputIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$network ?
							caip2StringFromValue(transaction.$network.caip2)
						:
							transaction.$network.slug
					),
					transactionId: transaction.txId,
					inputIndex: String(selection.entitySelector.inputIndex),
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
		<NumberValue
			value={selection.entitySelector.inputIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$asset}
		>
			{#snippet children(elementsAsset)}
				{#if elementsAsset != null}
					<ElementsAssetView
						selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
						prefetched={elementsAsset}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ResourceBoundary
			resource={selection.$reissuanceTokenAsset}
		>
			{#snippet children(elementsAsset)}
				{#if elementsAsset != null}
					<ElementsAssetView
						selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
						prefetched={elementsAsset}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={elementsIssuance}>
			{#snippet children(entity)}
				{@const isReissuance = entity.isReissuance}
				{#if isReissuance != null}
					<span data-text="muted">
						{isReissuance ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<UtxoTransactionView
						selection={select(EntityType.UtxoTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Input index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.inputIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$asset}
			>
				{#snippet children(elementsAsset)}
					{#if elementsAsset != null}
						<div>
							<dt>Asset</dt>
							<dd>
								<ElementsAssetView
									selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
									prefetched={elementsAsset}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$reissuanceTokenAsset}
			>
				{#snippet children(elementsAsset)}
					{#if elementsAsset != null}
						<div>
							<dt>Reissuance token asset</dt>
							<dd>
								<ElementsAssetView
									selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
									prefetched={elementsAsset}
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
							issuedAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const issuedAmount = entity.issuedAmount}
					{#if issuedAmount != null}
						<div>
							<dt>Issued amount</dt>
							<dd>
								<NumberValue
									value={issuedAmount}
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
							tokenAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenAmount = entity.tokenAmount}
					{#if tokenAmount != null}
						<div>
							<dt>Token amount</dt>
							<dd>
								<NumberValue
									value={tokenAmount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={elementsIssuance}
			>
				{#snippet children(entity)}
					{@const isReissuance = entity.isReissuance}
					{#if isReissuance != null}
						<div>
							<dt>Reissuance</dt>
							<dd>
								{isReissuance ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetEntropy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetEntropy = entity.assetEntropy}
					{#if assetEntropy != null}
						<div>
							<dt>Asset entropy</dt>
							<dd>
								<TruncatedValue value={assetEntropy} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetBlindingNonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetBlindingNonce = entity.assetBlindingNonce}
					{#if assetBlindingNonce != null}
						<div>
							<dt>Asset blinding nonce</dt>
							<dd>
								<TruncatedValue value={assetBlindingNonce} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
