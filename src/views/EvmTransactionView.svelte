<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
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
			Source.Voltaire_JsonRpc,
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
	const titleFallback = $derived([String((pendingEntity.txHash) ?? '')].filter(Boolean).join(' ') || 'EVM transaction')
	const viewDomId = $derived('evm-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import EvmInternalTransfersView from '$/views/EvmInternalTransfersView.svelte'
	import EvmLogsView from '$/views/EvmLogsView.svelte'
	import EvmTracesView from '$/views/EvmTracesView.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
	import Eip7702AuthorizationsView from '$/views/Eip7702AuthorizationsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.txHash !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
			network: String(pendingEntity.$network.slug ?? ''),
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
				{@const txHash0 = pendingEntity.txHash}
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
				{@const txHash0 = pendingEntity.txHash}
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
				resource={selection.$block}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmBlock)}
					{#if evmBlock != null && evmBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, evmBlock[EntityMetaKey.Selector])}
									prefetched={evmBlock}
									href={
										(evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.slug !== undefined && evmBlock[EntityMetaKey.Selector].blockNumber !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
											network: String(evmBlock[EntityMetaKey.Selector].$network.slug ?? ''),
											blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
										}) : undefined)
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
				<dt>From</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$from}
					>
						{#snippet children(evmAccount)}
							{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
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

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.slug !== undefined && evmContract[EntityMetaKey.Selector].address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
											network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
											address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
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
							{@const kind = pendingEntity.kind}
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
							{@const value = pendingEntity.value}
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
					{@const executionStatus = pendingEntity.executionStatus}
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
					{@const gasUsed = pendingEntity.gasUsed}
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
						{@const gas = pendingEntity.gas}
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
						{@const gasPrice = pendingEntity.gasPrice}
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
						{@const effectiveGasPrice = pendingEntity.effectiveGasPrice}
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

			<ProjectionBoundary
				resource={selection.FeeMarket}
			>
				{#snippet Applicable(projection)}
					{#if contentOpen}
						<ResourceBoundary
							resource={
								projection.maxFeePerGas({
									fields: {
										maxFeePerGas: true,
									},
								})
							}
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(maxFeePerGas)}
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
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.FeeMarket}
			>
				{#snippet Applicable(projection)}
					{#if contentOpen}
						<ResourceBoundary
							resource={
								projection.maxPriorityFeePerGas({
									fields: {
										maxPriorityFeePerGas: true,
									},
								})
							}
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(maxPriorityFeePerGas)}
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
				{/snippet}
			</ProjectionBoundary>

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
						{@const cumulativeGasUsed = pendingEntity.cumulativeGasUsed}
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
								{@const envelopeType = pendingEntity.envelopeType}
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
						{@const nonce = pendingEntity.nonce}
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
						{@const indexInBlock = pendingEntity.indexInBlock}
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
						{@const input = pendingEntity.input}
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
						{@const r = pendingEntity.r}
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
						{@const s = pendingEntity.s}
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
						{@const v = pendingEntity.v}
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

			<ProjectionBoundary
				resource={selection.Blob}
			>
				{#snippet Applicable(projection)}
					{#if contentOpen}
						<ResourceBoundary
							resource={
								projection.blobGasUsed({
									fields: {
										blobGasUsed: true,
									},
								})
							}
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(blobGasUsed)}
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
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Blob}
			>
				{#snippet Applicable(projection)}
					{#if contentOpen}
						<ResourceBoundary
							resource={
								projection.maxFeePerBlobGas({
									fields: {
										maxFeePerBlobGas: true,
									},
								})
							}
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(maxFeePerBlobGas)}
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
				{/snippet}
			</ProjectionBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-evm-tx-transfers'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'evm-tx-token-transfers',
							label: 'Token transfers',
						},
						{
							id: 'evm-tx-internal-transfers',
							label: 'Internal transfers',
						},
					]
				}
				data-card
				class='network-view-collapsible-transfers'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Transfers</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEvmTxTokenTransfers({ id, label, open })}
					<EvmTokenTransfersView
						selection={selection.$$tokenTransfers}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No token transfers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEvmTxInternalTransfers({ id, label, open })}
					<EvmInternalTransfersView
						selection={selection.$$internalTransfers}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No internal transfers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-evm-tx-execution'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'evm-tx-logs',
							label: 'Logs',
						},
						{
							id: 'evm-tx-traces',
							label: 'Traces',
						},
						{
							id: 'evm-tx-blobs',
							label: 'Blobs',
						},
					]
				}
				data-card
				class='network-view-collapsible-execution'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Execution</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEvmTxLogs({ id, label, open })}
					<EvmLogsView
						selection={selection.$$logs}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No logs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEvmTxTraces({ id, label, open })}
					<EvmTracesView
						selection={selection.$$traces}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No traces.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEvmTxBlobs({ id, label, open })}
					<ProjectionBoundary
						resource={selection.Blob}
					>
						{#snippet Applicable(projection)}
							<EvmBlobsView
								selection={projection.$$blobs}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No blobs.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}
					</ProjectionBoundary>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-evm-tx-account-abstraction'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'evm-tx-user-operations',
							label: 'User operations',
						},
						{
							id: 'evm-tx-authorizations',
							label: 'Authorizations',
						},
					]
				}
				data-card
				class='network-view-collapsible-account-abstraction'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Account abstraction</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEvmTxUserOperations({ id, label, open })}
					<EvmUserOperationsView
						selection={selection.$$userOperations}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No user operations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEvmTxAuthorizations({ id, label, open })}
					<Eip7702AuthorizationsView
						selection={selection.$$authorizations}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No authorizations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
