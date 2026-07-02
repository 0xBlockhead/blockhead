<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmBlob>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmBlob>>
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

	const evmBlob = $derived(selection({
		sources: [
			Source.Voltaire_JsonRpc,
			Source.Blobscan_Rest,
		],
		fields: {
			versionedHash: true,
			$block: true,
			...(open && {
				kzgCommitment: true,
			}),
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') ? 'Blob #' + String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') : '') || 'EVM blob')
	const viewDomId = $derived('evm-blob-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlob}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2.reference)}`,
			transactionId: String(({ ...selection.entitySelector, ...prefetched }).$transaction.txHash),
			indexInTransaction: String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Blob </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const versionedHash0 = prefetched.versionedHash}
			{#if versionedHash0 !== undefined && versionedHash0 !== null}
				<span data-text="muted">
					<TruncatedValue value={String(versionedHash0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={evmBlob}>
				{#snippet Pending()}
					{@const versionedHash0 = prefetched.versionedHash}
					{#if versionedHash0 !== undefined && versionedHash0 !== null}
						<span data-text="muted">
							<TruncatedValue value={String(versionedHash0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const versionedHash0 = entity.versionedHash}
					{#if versionedHash0 !== undefined && versionedHash0 !== null}
						<span data-text="muted">
							<TruncatedValue value={String(versionedHash0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
					<ResourceBoundary resource={evmBlob}>
						{#snippet Pending()}
							{@const indexInTransaction = prefetched.indexInTransaction ?? selection.entitySelector.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<span>#</span>
								{String((indexInTransaction) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const indexInTransaction = entity.indexInTransaction ?? selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<span>#</span>
								{String((indexInTransaction) ?? '')}
							{/if}
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
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${String(selection.entitySelector.$transaction.$network.caip2.namespace)}:${String(selection.entitySelector.$transaction.$network.caip2.reference)}`,
								transactionId: String(selection.entitySelector.$transaction.txHash),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Block</dt>
					<dd>
						<ResourceBoundary
							resource={selection[EntityProxyField]<EntityType.EvmBlock, false>('$block')}
						>
							{#snippet children(evmBlock)}
								<EvmBlockView
									selection={select(EntityType.EvmBlock, evmBlock.entitySelector)}
									prefetched={evmBlock}
									href={
										resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]', {
											caip2: `${String(evmBlock.entitySelector.$network.caip2.namespace)}:${String(evmBlock.entitySelector.$network.caip2.reference)}`,
											blockNumber: String(evmBlock.entitySelector.blockNumber),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmBlob}>
					{#snippet Pending()}
						{@const kzgCommitment = prefetched.kzgCommitment ?? selection.entitySelector.kzgCommitment}
						{#if kzgCommitment !== undefined && kzgCommitment !== null}
							<div>
								<dt>KZG commitment</dt>
								<dd>
									<TruncatedValue value={String(kzgCommitment)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const kzgCommitment = entity.kzgCommitment ?? selection.entitySelector.kzgCommitment ?? prefetched.kzgCommitment}
						{#if kzgCommitment !== undefined && kzgCommitment !== null}
							<div>
								<dt>KZG commitment</dt>
								<dd>
									<TruncatedValue value={String(kzgCommitment)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
