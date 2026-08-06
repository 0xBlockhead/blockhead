<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CardanoTxOutput>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockfrost_Rest,
		],
	}))
	const cardanoTxOutput = $derived(viewSelection({
		fields: {
			lovelace: true,
			address: true,
		},
	}))
	const viewDomId = $derived('cardano-tx-output-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? String(selection.entitySelector.outputIndex)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$network ?
							caip2StringFromValue(transaction.$network.caip2)
						:
							transaction.$network.slug
					),
					transactionId: transaction.hash,
					outputIndex: String(selection.entitySelector.outputIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={cardanoTxOutput}>
			{#snippet children(entity)}
				{String(entity.lovelace ?? '') || String(selection.entitySelector.outputIndex)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cardanoTxOutput}>
			{#snippet children(entity)}
				{@const address = entity.address}
				{#if address != null}
					<span data-text="muted">
						<TruncatedValue value={address} />
					</span>
				{/if}
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
				<dt>output index</dt>
				<dd>
					{selection.entitySelector.outputIndex}
				</dd>
			</div>

			<ResourceBoundary
				resource={cardanoTxOutput}
			>
				{#snippet children(entity)}
					{@const address = entity.address}
					{#if address != null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={address} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$address}
			>
				{#snippet children(cardanoAddress)}
					{#if cardanoAddress != null}
						<div>
							<dt>Address</dt>
							<dd>
								<CardanoAddressView
									selection={select(EntityType.CardanoAddress, cardanoAddress[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cardanoTxOutput}
			>
				{#snippet children(entity)}
					{@const lovelace = entity.lovelace}
					{#if lovelace != null}
						<div>
							<dt>lovelace</dt>
							<dd>
								{lovelace}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							datumHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const datumHash = entity.datumHash}
					{#if datumHash != null}
						<div>
							<dt>datum hash</dt>
							<dd>
								<TruncatedValue value={datumHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							referenceScriptHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const referenceScriptHash = entity.referenceScriptHash}
					{#if referenceScriptHash != null}
						<div>
							<dt>reference script hash</dt>
							<dd>
								<TruncatedValue value={referenceScriptHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-cardano-transaction-output-assets'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'cardano-transaction-output-assets-list',
						label: 'Assets',
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

			{#snippet SectionCardanoTransactionOutputAssetsList({ id, label })}
				<CardanoTxOutputAssetsView
					selection={selection.$$assets}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
