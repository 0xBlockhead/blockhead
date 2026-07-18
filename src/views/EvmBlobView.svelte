<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.EvmBlob>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmBlob>>
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
	const evmBlob = $derived(selection({
		sources: selection.sources,
		fields: {
			versionedHash: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.indexInTransaction) ?? '') ? 'Blob #' + String((pendingEntity.indexInTransaction) ?? '') : '') || 'EVM blob')
	const viewDomId = $derived('evm-blob-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlob}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInTransaction ?? '')}
	href={
		href ?? (pendingEntity.$transaction !== undefined && pendingEntity.$transaction.txHash !== undefined && pendingEntity.indexInTransaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]', {
			transactionId: String(pendingEntity.$transaction.txHash ?? ''),
			indexInTransaction: String(pendingEntity.indexInTransaction ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$transaction.$network.caip2) ?? ''),
		}) : pendingEntity.$transaction !== undefined && pendingEntity.$transaction.txHash !== undefined && pendingEntity.indexInTransaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]', {
			transactionId: String(pendingEntity.$transaction.txHash ?? ''),
			indexInTransaction: String(pendingEntity.indexInTransaction ?? ''),
			network: String(pendingEntity.$transaction.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.indexInTransaction}
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
		{@const serialValue = pendingEntity.indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const versionedHash0 = pendingEntity.versionedHash}
			{#if versionedHash0 !== undefined && versionedHash0 !== null}
				<span data-text="muted">
					<TruncatedValue value={String((versionedHash0) ?? '')} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={evmBlob}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const versionedHash0 = resolvedEntity.versionedHash}
					{#if versionedHash0 !== undefined && versionedHash0 !== null}
						<span data-text="muted">
							<TruncatedValue value={String((versionedHash0) ?? '')} />
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
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexInTransaction: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInTransaction = resolvedEntity.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<span>#</span>
								{String((indexInTransaction) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Versioned hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									versionedHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const versionedHash = resolvedEntity.versionedHash}
							{#if versionedHash !== undefined && versionedHash !== null}
								<TruncatedValue value={String((versionedHash) ?? '')} />
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
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$transaction, {})}
						href={
							(selection.entitySelector.$transaction.txHash !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
								transactionId: String(selection.entitySelector.$transaction.txHash ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
							}) : selection.entitySelector.$transaction.txHash !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
								transactionId: String(selection.entitySelector.$transaction.txHash ?? ''),
								network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
							}) : undefined)
						}
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
								{#if evmBlock != null && evmBlock[EntityMetaKey.Selector] != null}
									<EvmBlockView
										selection={select(EntityType.EvmBlock, evmBlock[EntityMetaKey.Selector])}
										prefetched={evmBlock}
										href={
											(evmBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
												blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
												network: String(caip2StringFromValue(evmBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
											}) : evmBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
												blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
												network: String(evmBlock[EntityMetaKey.Selector].$network.slug ?? ''),
											}) : undefined)
										}
										layout={EntityLayout.Value}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								kzgCommitment: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const kzgCommitment = resolvedEntity.kzgCommitment}
						{#if kzgCommitment !== undefined && kzgCommitment !== null}
							<div>
								<dt>KZG commitment</dt>
								<dd>
									<TruncatedValue value={String((kzgCommitment) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
