<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
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
	}: EntitySelectionViewProps<EntityType.EvmBlob> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Voltaire_JsonRpc,
			Source.Blobscan_Rest,
		],
	}))
	const evmBlob = $derived(viewSelection({
		fields: {
			versionedHash: true,
		},
	}))
	const titleFallback = $derived((String(pendingEntity.indexInTransaction ?? '') ? 'Blob #' + String(pendingEntity.indexInTransaction ?? '') : '') || 'EVM blob')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlob}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInTransaction ?? '')}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]',
			{
				network: (
					'caip2' in selection.entitySelector.$transaction.$network ?
						String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2))
					:
						String(selection.entitySelector.$transaction.$network.slug)
				),
				transactionId: String(selection.entitySelector.$transaction.txHash),
				indexInTransaction: String(selection.entitySelector.indexInTransaction),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Blob </span>
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
		<ResourceBoundary resource={evmBlob}>
			{#snippet children(entity)}
				<span data-text="muted">
					<TruncatedValue value={String(entity.versionedHash)} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A blob sidecar referenced by an EIP-4844 EVM transaction.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in transaction</dt>
				<dd>
					<span>#</span>
					{String(pendingEntity.indexInTransaction)}
				</dd>
			</div>

			<div>
				<dt>Versioned hash</dt>
				<dd>
					<ResourceBoundary
						resource={evmBlob}
					>
						{#snippet children(entity)}
							<TruncatedValue value={String(entity.versionedHash)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Block</dt>
					<dd>
						<ResourceBoundary
							resource={selection.$block}
						>
							{#snippet children(evmBlock)}
								<EvmBlockView
									selection={select(EntityType.EvmBlock, evmBlock[EntityMetaKey.Selector])}
									prefetched={evmBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								kzgCommitment: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const kzgCommitment = entity.kzgCommitment}
						{#if kzgCommitment != null}
							<div>
								<dt>KZG commitment</dt>
								<dd>
									<TruncatedValue value={kzgCommitment} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
