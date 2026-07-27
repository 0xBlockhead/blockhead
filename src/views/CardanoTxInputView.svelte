<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.CardanoTxInput> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockfrost_Rest,
		],
	}))
	const cardanoTxInput = $derived(viewSelection({
		fields: {
			inputKind: true,
			spentTxHash: true,
		},
	}))
	const titleFallback = $derived((String(pendingEntity.inputIndex ?? '') ? 'Input ' + String(pendingEntity.inputIndex ?? '') : '') || 'Cardano transaction input')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import CardanoTxOutputView from '$/views/CardanoTxOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoTxInput}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/input/[inputIndex=nonNegativeInteger]',
			{
				network: (
					'caip2' in selection.entitySelector.$transaction.$network ?
						String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2))
					:
						String(selection.entitySelector.$transaction.$network.slug)
				),
				transactionId: String(selection.entitySelector.$transaction.hash),
				inputIndex: String(selection.entitySelector.inputIndex),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span>Input </span>
		<NumberValue
			value={pendingEntity.inputIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cardanoTxInput}>
			{#snippet children(entity)}
				{(entity.inputKind ?? '') || (String(pendingEntity.inputIndex) ? 'Input ' + String(pendingEntity.inputIndex) : '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cardanoTxInput}>
			{#snippet children(entity)}
				{@const spentTxHash0 = entity.spentTxHash}
				{#if spentTxHash0 != null}
					<span data-text="muted">
						<TruncatedValue value={spentTxHash0} />
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
				<dt>input index</dt>
				<dd>
					<NumberValue
						value={pendingEntity.inputIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={cardanoTxInput}
			>
				{#snippet children(entity)}
					{@const inputKind = entity.inputKind}
					{#if inputKind != null}
						<div>
							<dt>input kind</dt>
							<dd>
								{inputKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={cardanoTxInput}
			>
				{#snippet children(entity)}
					{@const spentTxHash = entity.spentTxHash}
					{#if spentTxHash != null}
						<div>
							<dt>spent transaction hash</dt>
							<dd>
								<TruncatedValue value={spentTxHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							spentOutputIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spentOutputIndex = entity.spentOutputIndex}
					{#if spentOutputIndex != null}
						<div>
							<dt>spent output index</dt>
							<dd>
								<NumberValue
									value={spentOutputIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$spentOutput}
			>
				{#snippet children(cardanoTxOutput)}
					{#if cardanoTxOutput != null}
						<div>
							<dt>spent output</dt>
							<dd>
								<CardanoTxOutputView
									selection={select(EntityType.CardanoTxOutput, cardanoTxOutput[EntityMetaKey.Selector])}
									prefetched={cardanoTxOutput}
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
					viewSelection({
						fields: {
							redeemerIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const redeemerIndex = entity.redeemerIndex}
					{#if redeemerIndex != null}
						<div>
							<dt>redeemer index</dt>
							<dd>
								<NumberValue
									value={redeemerIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
