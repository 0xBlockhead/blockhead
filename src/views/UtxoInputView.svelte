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
			selection: RegisteredEntityProxyResource<EntityType.UtxoInput>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.UtxoInput>
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
	const utxoInput = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived((String((pendingEntity.indexInTransaction) ?? '') ? 'Input #' + String((pendingEntity.indexInTransaction) ?? '') : '') || 'UTXO input')
	const viewDomId = $derived('utxo-input-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoInput}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInTransaction ?? '')}
	href={
		href ?? (
			selection.entitySelector != null && 'indexInTransaction' in selection.entitySelector
			&& selection.entitySelector.indexInTransaction != null
			&& selection.entitySelector != null && '$transaction' in selection.entitySelector
			&& selection.entitySelector.$transaction != null && 'txId' in selection.entitySelector.$transaction
			&& selection.entitySelector.$transaction.txId != null
			&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction ?
				selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
				&& selection.entitySelector.$transaction.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/input/[inputIndex=nonNegativeInteger]', {
				inputIndex: String(selection.entitySelector.indexInTransaction ?? ''),
				transactionId: String(selection.entitySelector.$transaction.txId ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
					&& selection.entitySelector.$transaction.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/input/[inputIndex=nonNegativeInteger]', {
					inputIndex: String(selection.entitySelector.indexInTransaction ?? ''),
					transactionId: String(selection.entitySelector.$transaction.txId ?? ''),
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
		{@const serialValue = pendingEntity.indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Input </span>
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
		<ResourceBoundary resource={utxoInput}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$spentOutput}
				>
					{#snippet children(utxoOutput)}
						{#if utxoOutput != null && utxoOutput[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<UtxoOutputView
									selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
									prefetched={utxoOutput}
									href={
										(
											utxoOutput[EntityMetaKey.Selector] != null && 'indexInTransaction' in utxoOutput[EntityMetaKey.Selector]
											&& utxoOutput[EntityMetaKey.Selector].indexInTransaction != null
											&& utxoOutput[EntityMetaKey.Selector] != null && '$transaction' in utxoOutput[EntityMetaKey.Selector]
											&& utxoOutput[EntityMetaKey.Selector].$transaction != null && 'txId' in utxoOutput[EntityMetaKey.Selector].$transaction
											&& utxoOutput[EntityMetaKey.Selector].$transaction.txId != null
											&& utxoOutput[EntityMetaKey.Selector].$transaction != null && '$network' in utxoOutput[EntityMetaKey.Selector].$transaction ?
												utxoOutput[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in utxoOutput[EntityMetaKey.Selector].$transaction.$network
												&& utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
												outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
												transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
												network: String(caip2StringFromValue(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
											})
											:
													utxoOutput[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in utxoOutput[EntityMetaKey.Selector].$transaction.$network
													&& utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
													outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
													transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
													network: String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
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
								<NumberValue
									value={indexInTransaction}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$spentOutput}
			>
				{#snippet children(utxoOutput)}
					{#if utxoOutput != null && utxoOutput[EntityMetaKey.Selector] != null}
						<div>
							<dt>Spent output</dt>
							<dd>
								<UtxoOutputView
									selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
									prefetched={utxoOutput}
									href={
										(
											utxoOutput[EntityMetaKey.Selector] != null && 'indexInTransaction' in utxoOutput[EntityMetaKey.Selector]
											&& utxoOutput[EntityMetaKey.Selector].indexInTransaction != null
											&& utxoOutput[EntityMetaKey.Selector] != null && '$transaction' in utxoOutput[EntityMetaKey.Selector]
											&& utxoOutput[EntityMetaKey.Selector].$transaction != null && 'txId' in utxoOutput[EntityMetaKey.Selector].$transaction
											&& utxoOutput[EntityMetaKey.Selector].$transaction.txId != null
											&& utxoOutput[EntityMetaKey.Selector].$transaction != null && '$network' in utxoOutput[EntityMetaKey.Selector].$transaction ?
												utxoOutput[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in utxoOutput[EntityMetaKey.Selector].$transaction.$network
												&& utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
												outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
												transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
												network: String(caip2StringFromValue(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
											})
											:
													utxoOutput[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in utxoOutput[EntityMetaKey.Selector].$transaction.$network
													&& utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
													outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
													transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
													network: String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							coinbaseScript: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const coinbaseScript = resolvedEntity.coinbaseScript}
					{#if coinbaseScript !== undefined && coinbaseScript !== null}
						<div>
							<dt>Coinbase script</dt>
							<dd>
								{String((coinbaseScript) ?? '')}
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
							scriptSigAsm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const scriptSigAsm = resolvedEntity.scriptSigAsm}
					{#if scriptSigAsm !== undefined && scriptSigAsm !== null}
						<div>
							<dt>Script sig asm</dt>
							<dd>
								{String((scriptSigAsm) ?? '')}
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
							sequence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sequence = resolvedEntity.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>Sequence</dt>
							<dd>
								{String((sequence) ?? '')}
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
								sources: selection.sources,
								fields: {
									witness: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const witness = resolvedEntity.witness}
							{#if witness !== undefined && witness !== null}
								{witness.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
