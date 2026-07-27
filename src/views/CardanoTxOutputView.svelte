<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CardanoTxOutput> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
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
	const titleFallback = $derived(String(pendingEntity.outputIndex ?? '') || 'Cardano transaction output')
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
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/output/[outputIndex=nonNegativeInteger]',
			{
				network: (
					'caip2' in selection.entitySelector.$transaction.$network ?
						String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2))
					:
						String(selection.entitySelector.$transaction.$network.slug)
				),
				transactionId: String(selection.entitySelector.$transaction.hash),
				outputIndex: String(selection.entitySelector.outputIndex),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{String(pendingEntity.outputIndex ?? '') || 'Cardano transaction output'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cardanoTxOutput}>
			{#snippet children(entity)}
				{String(entity.lovelace ?? '') || String(pendingEntity.outputIndex) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cardanoTxOutput}>
			{#snippet children(entity)}
				{@const address0 = entity.address}
				{#if address0 != null}
					<span data-text="muted">
						<TruncatedValue value={address0} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<CardanoTransactionView
						selection={select(EntityType.CardanoTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>output index</dt>
				<dd>
					{String(pendingEntity.outputIndex)}
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
									prefetched={cardanoAddress}
									layout={EntityLayout.Value}
									open={false}
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
								{String(lovelace)}
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

	{#snippet Details({ open: detailsOpen })}
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

			{#snippet SectionCardanoTransactionOutputAssetsList({ id, label, open })}
				<CardanoTxOutputAssetsView
					selection={selection.$$assets}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
