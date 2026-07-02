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
			...(open && {
				nonce: true,
				indexInBlock: true,
				gas: true,
				gasPrice: true,
				cumulativeGasUsed: true,
				envelopeType: true,
				maxFeePerGas: true,
				maxPriorityFeePerGas: true,
				effectiveGasPrice: true,
				input: true,
				r: true,
				s: true,
				v: true,
				blobGasUsed: true,
				maxFeePerBlobGas: true,
				traceRoot: true,
				traceUnavailable: true,
				$$blobs: true,
				$$logs: true,
				$$internalTransfers: true,
				$$tokenTransfers: true,
				$$userOperations: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).txHash) ?? '')].filter(Boolean).join(' ') || 'EVM transaction')
	const viewDomId = $derived('evm-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import EvmInternalTransfersView from '$/views/EvmInternalTransfersView.svelte'
	import EvmLogsView from '$/views/EvmLogsView.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTransaction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			transactionId: String(({ ...selection.entitySelector, ...prefetched }).txHash),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const txHash0 = ({ ...selection.entitySelector, ...prefetched }).txHash}
			{#if txHash0 !== undefined && txHash0 !== null}
				<TruncatedValue value={String(txHash0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={evmTransaction}>
				{#snippet Pending()}
					{@const txHash0 = ({ ...selection.entitySelector, ...prefetched }).txHash}
					{#if txHash0 !== undefined && txHash0 !== null}
						<TruncatedValue value={String(txHash0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const txHash0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).txHash}
					{#if txHash0 !== undefined && txHash0 !== null}
						<TruncatedValue value={String(txHash0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const txHash0 = ({ ...selection.entitySelector, ...prefetched }).txHash}
			{#if txHash0 !== undefined && txHash0 !== null}
				<TruncatedValue value={String(txHash0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={evmTransaction}>
				{#snippet Pending()}
					{@const txHash0 = ({ ...selection.entitySelector, ...prefetched }).txHash}
					{#if txHash0 !== undefined && txHash0 !== null}
						<TruncatedValue value={String(txHash0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const txHash0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).txHash}
					{#if txHash0 !== undefined && txHash0 !== null}
						<TruncatedValue value={String(txHash0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
					{#if evmBlock != null}
						<div>
							<dt>Block</dt>
							<dd>
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
							<EvmAccountView
								selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
								prefetched={evmAccount}
								href={
									resolve('/(explore)/account/[address=evmAddress]', {
										address: String(evmAccount.entitySelector.address),
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$to')}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
									prefetched={evmAccount}
									href={
										resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount.entitySelector.address),
										})
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
					{#if evmContract != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract.entitySelector)}
									prefetched={evmContract}
									href={
										resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
											caip2: `${String(evmContract.entitySelector.$network.caip2.namespace)}:${String(evmContract.entitySelector.$network.caip2.reference)}`,
											address: String(evmContract.entitySelector.address),
										})
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
					<ResourceBoundary resource={evmTransaction}>
						{#snippet Pending()}
							{@const kind = prefetched.kind ?? selection.entitySelector.kind}
							{#if kind !== undefined && kind !== null}
								{String((kind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const kind = entity.kind ?? selection.entitySelector.kind ?? prefetched.kind}
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
					<ResourceBoundary resource={evmTransaction}>
						{#snippet Pending()}
							{@const value = prefetched.value ?? selection.entitySelector.value}
							{#if value !== undefined && value !== null}
								<NumberValue value={Number(value)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const value = entity.value ?? selection.entitySelector.value ?? prefetched.value}
							{#if value !== undefined && value !== null}
								<NumberValue value={Number(value)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={evmTransaction}>
				{#snippet Pending()}
					{@const executionStatus = prefetched.executionStatus ?? selection.entitySelector.executionStatus}
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
					{@const executionStatus = entity.executionStatus ?? selection.entitySelector.executionStatus ?? prefetched.executionStatus}
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

			<ResourceBoundary resource={evmTransaction}>
				{#snippet Pending()}
					{@const gasUsed = prefetched.gasUsed ?? selection.entitySelector.gasUsed}
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
					{@const gasUsed = entity.gasUsed ?? selection.entitySelector.gasUsed ?? prefetched.gasUsed}
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
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const gas = prefetched.gas ?? selection.entitySelector.gas}
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
						{@const gas = entity.gas ?? selection.entitySelector.gas ?? prefetched.gas}
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
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const gasPrice = prefetched.gasPrice ?? selection.entitySelector.gasPrice}
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
						{@const gasPrice = entity.gasPrice ?? selection.entitySelector.gasPrice ?? prefetched.gasPrice}
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
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const effectiveGasPrice = prefetched.effectiveGasPrice ?? selection.entitySelector.effectiveGasPrice}
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
						{@const effectiveGasPrice = entity.effectiveGasPrice ?? selection.entitySelector.effectiveGasPrice ?? prefetched.effectiveGasPrice}
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
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const maxFeePerGas = prefetched.maxFeePerGas ?? selection.entitySelector.maxFeePerGas}
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
						{@const maxFeePerGas = entity.maxFeePerGas ?? selection.entitySelector.maxFeePerGas ?? prefetched.maxFeePerGas}
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
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const maxPriorityFeePerGas = prefetched.maxPriorityFeePerGas ?? selection.entitySelector.maxPriorityFeePerGas}
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
						{@const maxPriorityFeePerGas = entity.maxPriorityFeePerGas ?? selection.entitySelector.maxPriorityFeePerGas ?? prefetched.maxPriorityFeePerGas}
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
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const cumulativeGasUsed = prefetched.cumulativeGasUsed ?? selection.entitySelector.cumulativeGasUsed}
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
						{@const cumulativeGasUsed = entity.cumulativeGasUsed ?? selection.entitySelector.cumulativeGasUsed ?? prefetched.cumulativeGasUsed}
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
						<ResourceBoundary resource={evmTransaction}>
							{#snippet Pending()}
								{@const envelopeType = prefetched.envelopeType ?? selection.entitySelector.envelopeType}
								{#if envelopeType !== undefined && envelopeType !== null}
									{String((envelopeType) ?? '')}
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const envelopeType = entity.envelopeType ?? selection.entitySelector.envelopeType ?? prefetched.envelopeType}
								{#if envelopeType !== undefined && envelopeType !== null}
									{String((envelopeType) ?? '')}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const nonce = prefetched.nonce ?? selection.entitySelector.nonce}
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
						{@const nonce = entity.nonce ?? selection.entitySelector.nonce ?? prefetched.nonce}
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
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const indexInBlock = prefetched.indexInBlock ?? selection.entitySelector.indexInBlock}
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
						{@const indexInBlock = entity.indexInBlock ?? selection.entitySelector.indexInBlock ?? prefetched.indexInBlock}
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
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const input = prefetched.input ?? selection.entitySelector.input}
						{#if input !== undefined && input !== null}
							<div>
								<dt>Input data</dt>
								<dd>
									<TruncatedValue value={String(input)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const input = entity.input ?? selection.entitySelector.input ?? prefetched.input}
						{#if input !== undefined && input !== null}
							<div>
								<dt>Input data</dt>
								<dd>
									<TruncatedValue value={String(input)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const r = prefetched.r ?? selection.entitySelector.r}
						{#if r !== undefined && r !== null}
							<div>
								<dt>Signature r</dt>
								<dd>
									<TruncatedValue value={String(r)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const r = entity.r ?? selection.entitySelector.r ?? prefetched.r}
						{#if r !== undefined && r !== null}
							<div>
								<dt>Signature r</dt>
								<dd>
									<TruncatedValue value={String(r)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const s = prefetched.s ?? selection.entitySelector.s}
						{#if s !== undefined && s !== null}
							<div>
								<dt>Signature s</dt>
								<dd>
									<TruncatedValue value={String(s)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const s = entity.s ?? selection.entitySelector.s ?? prefetched.s}
						{#if s !== undefined && s !== null}
							<div>
								<dt>Signature s</dt>
								<dd>
									<TruncatedValue value={String(s)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const v = prefetched.v ?? selection.entitySelector.v}
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
						{@const v = entity.v ?? selection.entitySelector.v ?? prefetched.v}
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
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const blobGasUsed = prefetched.blobGasUsed ?? selection.entitySelector.blobGasUsed}
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
						{@const blobGasUsed = entity.blobGasUsed ?? selection.entitySelector.blobGasUsed ?? prefetched.blobGasUsed}
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
				<ResourceBoundary resource={evmTransaction}>
					{#snippet Pending()}
						{@const maxFeePerBlobGas = prefetched.maxFeePerBlobGas ?? selection.entitySelector.maxFeePerBlobGas}
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
						{@const maxFeePerBlobGas = entity.maxFeePerBlobGas ?? selection.entitySelector.maxFeePerBlobGas ?? prefetched.maxFeePerBlobGas}
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
		{/if}
	{/snippet}
</EntityView>
