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

	const transaction = $derived(selection.entitySelector.$transaction)
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
	title={title ?? 'Input ' + String(selection.entitySelector.inputIndex)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/input/[inputIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$network ?
							caip2StringFromValue(transaction.$network.caip2)
						:
							transaction.$network.slug
					),
					transactionId: transaction.hash,
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
		<span>Input </span>
		<NumberValue
			value={selection.entitySelector.inputIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cardanoTxInput}>
			{#snippet children(entity)}
				{(entity.inputKind ?? '') || 'Input ' + String(selection.entitySelector.inputIndex)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cardanoTxInput}>
			{#snippet children(entity)}
				{@const spentTxHash = entity.spentTxHash}
				{#if spentTxHash != null}
					<span data-text="muted">
						<TruncatedValue value={spentTxHash} />
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
						value={selection.entitySelector.inputIndex}
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
