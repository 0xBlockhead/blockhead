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
	import { Source } from '$/sources/Source.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.CardanoTxOutput>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CardanoTxOutput>
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
	const cardanoTxOutput = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			lovelace: true,
			address: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			lovelace: true,
			address: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.outputIndex) ?? '')].filter(Boolean).join(' ') || 'Cardano transaction output')
	const viewDomId = $derived('cardano-tx-output-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import CardanoAddressView from '$/views/CardanoAddressView.svelte'
	import CardanoTxOutputAssetsView from '$/views/CardanoTxOutputAssetsView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoTxOutput}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'outputIndex' in selection.entitySelector
			&& selection.entitySelector.outputIndex != null
			&& selection.entitySelector != null && '$transaction' in selection.entitySelector
			&& selection.entitySelector.$transaction != null && 'hash' in selection.entitySelector.$transaction
			&& selection.entitySelector.$transaction.hash != null
			&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction ?
				selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
				&& selection.entitySelector.$transaction.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
				outputIndex: String(selection.entitySelector.outputIndex ?? ''),
				transactionId: String(selection.entitySelector.$transaction.hash ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
					&& selection.entitySelector.$transaction.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
					outputIndex: String(selection.entitySelector.outputIndex ?? ''),
					transactionId: String(selection.entitySelector.$transaction.hash ?? ''),
					network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'lovelace') && Object.hasOwn(prefetched, 'address')}
			{[String((pendingEntity.outputIndex) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoTxOutput}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.outputIndex) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'lovelace') && Object.hasOwn(prefetched, 'address')}
			{[String((pendingEntity.lovelace) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.outputIndex) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoTxOutput}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.lovelace) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.outputIndex) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'lovelace') && Object.hasOwn(prefetched, 'address')}
			{@const address0 = pendingEntity.address}
			{#if address0 !== undefined && address0 !== null}
				<span data-text="muted">
					<TruncatedValue value={String((address0) ?? '')} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cardanoTxOutput}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address0 = resolvedEntity.address}
					{#if address0 !== undefined && address0 !== null}
						<span data-text="muted">
							<TruncatedValue value={String((address0) ?? '')} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<CardanoTransactionView
						selection={select(EntityType.CardanoTransaction, selection.entitySelector.$transaction)}
						href={
							(
								selection.entitySelector.$transaction != null && 'hash' in selection.entitySelector.$transaction
								&& selection.entitySelector.$transaction.hash != null
								&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction ?
									selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
									&& selection.entitySelector.$transaction.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
									transactionId: String(selection.entitySelector.$transaction.hash ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
										&& selection.entitySelector.$transaction.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
										transactionId: String(selection.entitySelector.$transaction.hash ?? ''),
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
				<dt>output index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									outputIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const outputIndex = resolvedEntity.outputIndex}
							{#if outputIndex !== undefined && outputIndex !== null}
								{String((outputIndex) ?? '')}
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
							address: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address = resolvedEntity.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$address}
			>
				{#snippet children(cardanoAddress)}
					{#if cardanoAddress != null && cardanoAddress[EntityMetaKey.Selector] != null}
						<div>
							<dt>Address</dt>
							<dd>
								<CardanoAddressView
									selection={select(EntityType.CardanoAddress, cardanoAddress[EntityMetaKey.Selector])}
									prefetched={cardanoAddress}
									href={
										(
											cardanoAddress[EntityMetaKey.Selector] != null && 'address' in cardanoAddress[EntityMetaKey.Selector]
											&& cardanoAddress[EntityMetaKey.Selector].address != null
											&& cardanoAddress[EntityMetaKey.Selector] != null && '$network' in cardanoAddress[EntityMetaKey.Selector] ?
												cardanoAddress[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoAddress[EntityMetaKey.Selector].$network
												&& cardanoAddress[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
												accountId: String(cardanoAddress[EntityMetaKey.Selector].address ?? ''),
												network: String(caip2StringFromValue(cardanoAddress[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													cardanoAddress[EntityMetaKey.Selector].$network != null && 'slug' in cardanoAddress[EntityMetaKey.Selector].$network
													&& cardanoAddress[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
													accountId: String(cardanoAddress[EntityMetaKey.Selector].address ?? ''),
													network: String(cardanoAddress[EntityMetaKey.Selector].$network.slug ?? ''),
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
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							lovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lovelace = resolvedEntity.lovelace}
					{#if lovelace !== undefined && lovelace !== null}
						<div>
							<dt>lovelace</dt>
							<dd>
								{String((lovelace) ?? '')}
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
							datumHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const datumHash = resolvedEntity.datumHash}
					{#if datumHash !== undefined && datumHash !== null}
						<div>
							<dt>datum hash</dt>
							<dd>
								<TruncatedValue value={String((datumHash) ?? '')} />
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
							referenceScriptHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const referenceScriptHash = resolvedEntity.referenceScriptHash}
					{#if referenceScriptHash !== undefined && referenceScriptHash !== null}
						<div>
							<dt>reference script hash</dt>
							<dd>
								<TruncatedValue value={String((referenceScriptHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				<CollapsibleTabs
					id={viewDomId + '-carousel-cardano-transaction-output-assets'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'cardano-transaction-output-assets-list',
								label: 'Assets',
								ownsSection: true,
							},
						]
					}
					data-card
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Assets</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerCardanoTransactionOutputAssetsList(_context, Content)}
						{@const cardanoTransactionOutputAssetsListResource = selection
		.$$assets({
			sources: [
				Source.Blockfrost_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionOutputAssetsListResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionCardanoTransactionOutputAssetsList({ id, label, open, active })}
						{@const cardanoTransactionOutputAssetsListResource = selection
		.$$assets({
			sources: [
				Source.Blockfrost_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionOutputAssetsListResource}
						>
							{#snippet children(cardanoTxOutputAsset)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<CardanoTxOutputAssetsView
										selection={cardanoTransactionOutputAssetsListResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>
	{/snippet}
</EntityView>
