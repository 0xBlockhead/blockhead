<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.UtxoInput> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((String(pendingEntity.indexInTransaction ?? '') ? 'Input #' + String(pendingEntity.indexInTransaction ?? '') : '') || 'UTXO input')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoInput}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInTransaction ?? '')}
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
				transactionId: String(selection.entitySelector.$transaction.txId),
				inputIndex: String(selection.entitySelector.indexInTransaction),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Input </span>
			<span data-badge="small">
				#{String(pendingEntity.indexInTransaction)}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{String(pendingEntity.indexInTransaction)}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$spentOutput}
		>
			{#snippet children(utxoOutput)}
				{#if utxoOutput != null}
					<span data-text="muted">
						<UtxoOutputView
							selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
							prefetched={utxoOutput}
							layout={EntityLayout.Title}
							open={false}
						/>
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
					<NumberValue
						value={pendingEntity.indexInTransaction}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$spentOutput}
			>
				{#snippet children(utxoOutput)}
					{#if utxoOutput != null}
						<div>
							<dt>Spent output</dt>
							<dd>
								<UtxoOutputView
									selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
									prefetched={utxoOutput}
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
						selection={select(EntityType.UtxoTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							coinbaseScript: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const coinbaseScript = entity.coinbaseScript}
					{#if coinbaseScript != null}
						<div>
							<dt>Coinbase script</dt>
							<dd>
								{coinbaseScript}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							scriptSigAsm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const scriptSigAsm = entity.scriptSigAsm}
					{#if scriptSigAsm != null}
						<div>
							<dt>Script sig asm</dt>
							<dd>
								{scriptSigAsm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sequence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sequence = entity.sequence}
					{#if sequence != null}
						<div>
							<dt>Sequence</dt>
							<dd>
								{String(sequence)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Witness</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									witness: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.witness.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
