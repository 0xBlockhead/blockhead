<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { EvmTransactionEnvelopeType, EvmTransactionExecutionStatus, EvmTransactionKind } from '$/constants/Evm.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmTransaction>>
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
	const evmTransaction = $derived(selection({
		sources: [
			Source.Blockscout_Rest,
		],
		fields: {
			kind: true,
			value: true,
			executionStatus: true,
			gasUsed: true,
			$block: true,
			$from: true,
			$to: true,
			$contract: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.txHash ?? prefetched.txHash) ?? '')].filter(Boolean).join(' ') || 'EVM transaction')
	const viewDomId = $derived('evm-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import EvmInternalTransfersView from '$/views/EvmInternalTransfersView.svelte'
	import EvmLogsView from '$/views/EvmLogsView.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
	import Eip7702AuthorizationsView from '$/views/Eip7702AuthorizationsView.svelte'
	import EvmTracesView from '$/views/EvmTracesView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.txHash !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
			caip2: `${String(pendingEntity.$network.caip2.namespace ?? '')}:${String(pendingEntity.$network.caip2.reference ?? '')}`,
			transactionId: String(pendingEntity.txHash ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmTransaction}>
			{#snippet Pending()}
				{@const txHash0 = selection.entitySelector.txHash ?? prefetched.txHash}
				{#if txHash0 !== undefined && txHash0 !== null}
					<TruncatedValue value={String((txHash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const txHash0 = resolvedEntity.txHash}
				{#if txHash0 !== undefined && txHash0 !== null}
					<TruncatedValue value={String((txHash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmTransaction}>
			{#snippet Pending()}
				{@const txHash0 = selection.entitySelector.txHash ?? prefetched.txHash}
				{#if txHash0 !== undefined && txHash0 !== null}
					<TruncatedValue value={String((txHash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const txHash0 = resolvedEntity.txHash}
				{#if txHash0 !== undefined && txHash0 !== null}
					<TruncatedValue value={String((txHash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A transaction submitted to or included in an EVM-compatible network.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmBlock, false>('$block')}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null && evmBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, evmBlock[EntityMetaKey.Selector])}
									prefetched={evmBlock}
									href={
										(({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network !== undefined && ({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network.caip2 !== undefined && ({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network.caip2.namespace !== undefined && ({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network !== undefined && ({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network.caip2 !== undefined && ({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network.caip2.reference !== undefined && ({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).blockNumber !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]', {
											caip2: `${String(({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network.caip2.namespace ?? '')}:${String(({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network.caip2.reference ?? '')}`,
											blockNumber: String(({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).blockNumber ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>From</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$from')}
					>
						{#snippet children(evmAccount)}
							{#if evmAccount[EntityMetaKey.Selector] != null}
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(({ ...evmAccount[EntityMetaKey.Selector], ...evmAccount }).address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
											address: String(({ ...evmAccount[EntityMetaKey.Selector], ...evmAccount }).address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$to')}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(({ ...evmAccount[EntityMetaKey.Selector], ...evmAccount }).address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
											address: String(({ ...evmAccount[EntityMetaKey.Selector], ...evmAccount }).address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$contract')}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2 !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.namespace !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2 !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.reference !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
											caip2: `${String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.namespace ?? '')}:${String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.reference ?? '')}`,
											address: String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									kind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const kind = prefetched.kind}
							{#if kind !== undefined && kind !== null}
								{String((kind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const kind = resolvedEntity.kind}
							{#if kind !== undefined && kind !== null}
								{String((kind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Value</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									value: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const value = prefetched.value}
							{#if value !== undefined && value !== null}
								<NumberValue value={Number(value)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const value = resolvedEntity.value}
							{#if value !== undefined && value !== null}
								<NumberValue value={Number(value)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							executionStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const executionStatus = prefetched.executionStatus}
					{#if executionStatus !== undefined && executionStatus !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((executionStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const executionStatus = resolvedEntity.executionStatus}
					{#if executionStatus !== undefined && executionStatus !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((executionStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasUsed = prefetched.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue value={Number(gasUsed)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsed = resolvedEntity.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue value={Number(gasUsed)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								gas: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const gas = prefetched.gas}
						{#if gas !== undefined && gas !== null}
							<div>
								<dt>Gas limit</dt>
								<dd>
									<NumberValue value={Number(gas)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const gas = resolvedEntity.gas}
						{#if gas !== undefined && gas !== null}
							<div>
								<dt>Gas limit</dt>
								<dd>
									<NumberValue value={Number(gas)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								gasPrice: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const gasPrice = prefetched.gasPrice}
						{#if gasPrice !== undefined && gasPrice !== null}
							<div>
								<dt>Gas price</dt>
								<dd>
									<NumberValue value={Number(gasPrice)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const gasPrice = resolvedEntity.gasPrice}
						{#if gasPrice !== undefined && gasPrice !== null}
							<div>
								<dt>Gas price</dt>
								<dd>
									<NumberValue value={Number(gasPrice)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								effectiveGasPrice: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const effectiveGasPrice = prefetched.effectiveGasPrice}
						{#if effectiveGasPrice !== undefined && effectiveGasPrice !== null}
							<div>
								<dt>Effective gas price</dt>
								<dd>
									<NumberValue value={Number(effectiveGasPrice)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const effectiveGasPrice = resolvedEntity.effectiveGasPrice}
						{#if effectiveGasPrice !== undefined && effectiveGasPrice !== null}
							<div>
								<dt>Effective gas price</dt>
								<dd>
									<NumberValue value={Number(effectiveGasPrice)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								maxFeePerGas: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const maxFeePerGas = prefetched.maxFeePerGas}
						{#if maxFeePerGas !== undefined && maxFeePerGas !== null}
							<div>
								<dt>Max fee</dt>
								<dd>
									<NumberValue value={Number(maxFeePerGas)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const maxFeePerGas = resolvedEntity.maxFeePerGas}
						{#if maxFeePerGas !== undefined && maxFeePerGas !== null}
							<div>
								<dt>Max fee</dt>
								<dd>
									<NumberValue value={Number(maxFeePerGas)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								maxPriorityFeePerGas: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const maxPriorityFeePerGas = prefetched.maxPriorityFeePerGas}
						{#if maxPriorityFeePerGas !== undefined && maxPriorityFeePerGas !== null}
							<div>
								<dt>Priority fee</dt>
								<dd>
									<NumberValue value={Number(maxPriorityFeePerGas)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const maxPriorityFeePerGas = resolvedEntity.maxPriorityFeePerGas}
						{#if maxPriorityFeePerGas !== undefined && maxPriorityFeePerGas !== null}
							<div>
								<dt>Priority fee</dt>
								<dd>
									<NumberValue value={Number(maxPriorityFeePerGas)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								cumulativeGasUsed: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const cumulativeGasUsed = prefetched.cumulativeGasUsed}
						{#if cumulativeGasUsed !== undefined && cumulativeGasUsed !== null}
							<div>
								<dt>Cumulative gas used</dt>
								<dd>
									<NumberValue value={Number(cumulativeGasUsed)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const cumulativeGasUsed = resolvedEntity.cumulativeGasUsed}
						{#if cumulativeGasUsed !== undefined && cumulativeGasUsed !== null}
							<div>
								<dt>Cumulative gas used</dt>
								<dd>
									<NumberValue value={Number(cumulativeGasUsed)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Transaction envelope type</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection({
									fields: {
										envelopeType: true,
									},
								})
							}
						>
							{#snippet Pending()}
								{@const envelopeType = prefetched.envelopeType}
								{#if envelopeType !== undefined && envelopeType !== null}
									{String((envelopeType) ?? '')}
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const envelopeType = resolvedEntity.envelopeType}
								{#if envelopeType !== undefined && envelopeType !== null}
									{String((envelopeType) ?? '')}
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
							fields: {
								nonce: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const nonce = prefetched.nonce}
						{#if nonce !== undefined && nonce !== null}
							<div>
								<dt>Nonce</dt>
								<dd>
									{String((nonce) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const nonce = resolvedEntity.nonce}
						{#if nonce !== undefined && nonce !== null}
							<div>
								<dt>Nonce</dt>
								<dd>
									{String((nonce) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								indexInBlock: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const indexInBlock = prefetched.indexInBlock}
						{#if indexInBlock !== undefined && indexInBlock !== null}
							<div>
								<dt>Index in block</dt>
								<dd>
									{String((indexInBlock) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const indexInBlock = resolvedEntity.indexInBlock}
						{#if indexInBlock !== undefined && indexInBlock !== null}
							<div>
								<dt>Index in block</dt>
								<dd>
									{String((indexInBlock) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								input: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const input = prefetched.input}
						{#if input !== undefined && input !== null}
							<div>
								<dt>Input data</dt>
								<dd>
									<TruncatedValue value={String((input) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const input = resolvedEntity.input}
						{#if input !== undefined && input !== null}
							<div>
								<dt>Input data</dt>
								<dd>
									<TruncatedValue value={String((input) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								r: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const r = prefetched.r}
						{#if r !== undefined && r !== null}
							<div>
								<dt>Signature r</dt>
								<dd>
									<TruncatedValue value={String((r) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const r = resolvedEntity.r}
						{#if r !== undefined && r !== null}
							<div>
								<dt>Signature r</dt>
								<dd>
									<TruncatedValue value={String((r) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								s: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const s = prefetched.s}
						{#if s !== undefined && s !== null}
							<div>
								<dt>Signature s</dt>
								<dd>
									<TruncatedValue value={String((s) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const s = resolvedEntity.s}
						{#if s !== undefined && s !== null}
							<div>
								<dt>Signature s</dt>
								<dd>
									<TruncatedValue value={String((s) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								v: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const v = prefetched.v}
						{#if v !== undefined && v !== null}
							<div>
								<dt>Signature v</dt>
								<dd>
									{String((v) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const v = resolvedEntity.v}
						{#if v !== undefined && v !== null}
							<div>
								<dt>Signature v</dt>
								<dd>
									{String((v) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								blobGasUsed: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const blobGasUsed = prefetched.blobGasUsed}
						{#if blobGasUsed !== undefined && blobGasUsed !== null}
							<div>
								<dt>Blob gas used</dt>
								<dd>
									<NumberValue value={Number(blobGasUsed)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const blobGasUsed = resolvedEntity.blobGasUsed}
						{#if blobGasUsed !== undefined && blobGasUsed !== null}
							<div>
								<dt>Blob gas used</dt>
								<dd>
									<NumberValue value={Number(blobGasUsed)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								maxFeePerBlobGas: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const maxFeePerBlobGas = prefetched.maxFeePerBlobGas}
						{#if maxFeePerBlobGas !== undefined && maxFeePerBlobGas !== null}
							<div>
								<dt>Max fee per blob gas</dt>
								<dd>
									<NumberValue value={Number(maxFeePerBlobGas)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const maxFeePerBlobGas = resolvedEntity.maxFeePerBlobGas}
						{#if maxFeePerBlobGas !== undefined && maxFeePerBlobGas !== null}
							<div>
								<dt>Max fee per blob gas</dt>
								<dd>
									<NumberValue value={Number(maxFeePerBlobGas)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EvmTokenTransfersView
				selection={selection[EntityProxyField]<EntityType.EvmTokenTransfer>('$$tokenTransfers')}
				title='Token transfers'
				id='EvmTokenTransfersView-$$tokenTransfers'
			/>

			<EvmInternalTransfersView
				selection={selection[EntityProxyField]<EntityType.EvmInternalTransfer>('$$internalTransfers')}
				title='Internal transfers'
				id='EvmInternalTransfersView-$$internalTransfers'
			/>

			<EvmLogsView
				selection={selection[EntityProxyField]<EntityType.EvmLog>('$$logs')}
				title='Receipt logs'
				id='EvmLogsView-$$logs'
			/>

			<EvmBlobsView
				selection={selection[EntityProxyField]<EntityType.EvmBlob>('$$blobs')}
				title='Blobs'
				id='EvmBlobsView-$$blobs'
			/>

			<EvmUserOperationsView
				selection={selection[EntityProxyField]<EntityType.EvmUserOperation>('$$userOperations')}
				title='User operations'
				id='EvmUserOperationsView-$$userOperations'
			/>

			<Eip7702AuthorizationsView
				selection={selection[EntityProxyField]<EntityType.Eip7702Authorization>('$$authorizations')}
				title='EIP-7702 authorizations'
				id='Eip7702AuthorizationsView-$$authorizations'
			/>

			<EvmTracesView
				selection={selection[EntityProxyField]<EntityType.EvmTrace>('$$traces')}
				title='Traces'
				id='EvmTracesView-$$traces'
			/>
		{/if}
	{/snippet}
</EntityView>
