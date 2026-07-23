<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.ElementsIssuance>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.ElementsIssuance>
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
	const elementsIssuance = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			isReissuance: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			isReissuance: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.inputIndex) ?? '')].filter(Boolean).join(' ') || 'Elements issuance')
	const viewDomId = $derived('elements-issuance-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
	import ElementsAssetView from '$/views/ElementsAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsIssuance}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={elementsIssuance}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const inputIndex0 = resolvedEntity.inputIndex}
				{#if inputIndex0 !== undefined && inputIndex0 !== null}
					<NumberValue
						value={inputIndex0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsIssuance}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$asset}
				>
					{#snippet children(elementsAsset)}
						{#if elementsAsset != null && elementsAsset[EntityMetaKey.Selector] != null}
							<ElementsAssetView
								selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
								prefetched={elementsAsset}
								href=""
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={selection.$reissuanceTokenAsset}
				>
					{#snippet children(elementsAsset)}
						{#if elementsAsset != null && elementsAsset[EntityMetaKey.Selector] != null}
							<ElementsAssetView
								selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
								prefetched={elementsAsset}
								href=""
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={elementsIssuance}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const isReissuance0 = resolvedEntity.isReissuance}
				{#if isReissuance0 !== undefined && isReissuance0 !== null}
					<span data-text="muted">
						{isReissuance0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<UtxoTransactionView
						selection={select(EntityType.UtxoTransaction, selection.entitySelector.$transaction)}
						href={
							(
								selection.entitySelector.$transaction != null && 'txId' in selection.entitySelector.$transaction
								&& selection.entitySelector.$transaction.txId != null
								&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction ?
									selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
									&& selection.entitySelector.$transaction.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
									transactionId: String(selection.entitySelector.$transaction.txId ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
										&& selection.entitySelector.$transaction.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
										transactionId: String(selection.entitySelector.$transaction.txId ?? ''),
										network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Input index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									inputIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const inputIndex = resolvedEntity.inputIndex}
							{#if inputIndex !== undefined && inputIndex !== null}
								<NumberValue
									value={inputIndex}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$asset}
			>
				{#snippet children(elementsAsset)}
					{#if elementsAsset != null && elementsAsset[EntityMetaKey.Selector] != null}
						<div>
							<dt>Asset</dt>
							<dd>
								<ElementsAssetView
									selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
									prefetched={elementsAsset}
									layout={EntityLayout.Value}
									open={false}
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
					{#if elementsAsset != null && elementsAsset[EntityMetaKey.Selector] != null}
						<div>
							<dt>Reissuance token asset</dt>
							<dd>
								<ElementsAssetView
									selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
									prefetched={elementsAsset}
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
							issuedAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const issuedAmount = resolvedEntity.issuedAmount}
					{#if issuedAmount !== undefined && issuedAmount !== null}
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
						sources: selection.sources,
						fields: {
							tokenAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenAmount = resolvedEntity.tokenAmount}
					{#if tokenAmount !== undefined && tokenAmount !== null}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							isReissuance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isReissuance = resolvedEntity.isReissuance}
					{#if isReissuance !== undefined && isReissuance !== null}
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
						sources: selection.sources,
						fields: {
							assetEntropy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetEntropy = resolvedEntity.assetEntropy}
					{#if assetEntropy !== undefined && assetEntropy !== null}
						<div>
							<dt>Asset entropy</dt>
							<dd>
								<TruncatedValue value={String((assetEntropy) ?? '')} />
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
							assetBlindingNonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetBlindingNonce = resolvedEntity.assetBlindingNonce}
					{#if assetBlindingNonce !== undefined && assetBlindingNonce !== null}
						<div>
							<dt>Asset blinding nonce</dt>
							<dd>
								<TruncatedValue value={String((assetBlindingNonce) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
