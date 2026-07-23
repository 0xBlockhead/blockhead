<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { EvmTransactionEnvelopeType, EvmTransactionExecutionStatus, EvmTransactionKind } from '$/constants/Evm.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.EvmTransaction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EvmTransaction>
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
	const evmTransaction = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
		fields: {
			kind: true,
			value: true,
			executionStatus: true,
			gasUsed: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.txHash) ?? '')].filter(Boolean).join(' ') || 'EVM transaction')
	const viewDomId = $derived('evm-transaction-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
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
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import Eip7702AuthorizationsView from '$/views/Eip7702AuthorizationsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'txHash' in selection.entitySelector
			&& selection.entitySelector.txHash != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
				transactionId: String(selection.entitySelector.txHash ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
					transactionId: String(selection.entitySelector.txHash ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
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

	{#snippet Icon()}
		{#if layout !== EntityLayout.SummaryDetails}
			<IconComponent />
		{:else}
			<ResourceBoundary resource={evmTransaction}>
				{#snippet children(entity)}
					<IconComponent />
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{@const txHash0 = pendingEntity.txHash}
			{#if txHash0 !== undefined && txHash0 !== null}
				<TruncatedValue value={String((txHash0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={evmTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txHash0 = resolvedEntity.txHash}
					{#if txHash0 !== undefined && txHash0 !== null}
						<TruncatedValue value={String((txHash0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails}
			{@const txHash0 = pendingEntity.txHash}
			{#if txHash0 !== undefined && txHash0 !== null}
				<TruncatedValue value={String((txHash0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={evmTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txHash0 = resolvedEntity.txHash}
					{#if txHash0 !== undefined && txHash0 !== null}
						<TruncatedValue value={String((txHash0) ?? '')} />
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
				resource={selection.$block}
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
										(
											evmBlock[EntityMetaKey.Selector] != null && 'blockNumber' in evmBlock[EntityMetaKey.Selector]
											&& evmBlock[EntityMetaKey.Selector].blockNumber != null
											&& evmBlock[EntityMetaKey.Selector] != null && '$network' in evmBlock[EntityMetaKey.Selector] ?
												evmBlock[EntityMetaKey.Selector].$network != null && 'caip2' in evmBlock[EntityMetaKey.Selector].$network
												&& evmBlock[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
												blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
												network: String(caip2StringFromValue(evmBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													evmBlock[EntityMetaKey.Selector].$network != null && 'slug' in evmBlock[EntityMetaKey.Selector].$network
													&& evmBlock[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
													blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
													network: String(evmBlock[EntityMetaKey.Selector].$network.slug ?? ''),
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
										(
											evmAccount[EntityMetaKey.Selector] != null && 'address' in evmAccount[EntityMetaKey.Selector]
											&& evmAccount[EntityMetaKey.Selector].address != null ?
												resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										})
										:
												undefined
										)
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
				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(
											evmAccount[EntityMetaKey.Selector] != null && 'address' in evmAccount[EntityMetaKey.Selector]
											&& evmAccount[EntityMetaKey.Selector].address != null ?
												resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										})
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

			<ProjectionBoundary
				resource={selection.ContractCreation}
			>
				{#snippet Applicable(projection)}
					<ResourceBoundary
						resource={projection.$contract}
					>
						{#snippet children(evmContract)}
							{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
								<div>
									<dt>Created contract</dt>
									<dd>
										<EvmContractView
											selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
											prefetched={evmContract}
											href={
												(
													evmContract[EntityMetaKey.Selector] != null && 'address' in evmContract[EntityMetaKey.Selector]
													&& evmContract[EntityMetaKey.Selector].address != null
													&& evmContract[EntityMetaKey.Selector] != null && '$network' in evmContract[EntityMetaKey.Selector] ?
														evmContract[EntityMetaKey.Selector].$network != null && 'caip2' in evmContract[EntityMetaKey.Selector].$network
														&& evmContract[EntityMetaKey.Selector].$network.caip2 != null ?
															resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
														address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
														network: String(caip2StringFromValue(evmContract[EntityMetaKey.Selector].$network.caip2) ?? ''),
													})
													:
															evmContract[EntityMetaKey.Selector].$network != null && 'slug' in evmContract[EntityMetaKey.Selector].$network
															&& evmContract[EntityMetaKey.Selector].$network.slug != null ?
																resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
															address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
															network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									kind: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									value: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const value = resolvedEntity.value}
							{#if value !== undefined && value !== null}
								<NumberValue
									value={value}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							executionStatus: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsed = resolvedEntity.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue
									value={gasUsed}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								gas: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const gas = resolvedEntity.gas}
						{#if gas !== undefined && gas !== null}
							<div>
								<dt>Gas limit</dt>
								<dd>
									<NumberValue
										value={gas}
									/>
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
							sources: selection.sources,
							fields: {
								gasPrice: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const gasPrice = resolvedEntity.gasPrice}
						{#if gasPrice !== undefined && gasPrice !== null}
							<div>
								<dt>Gas price</dt>
								<dd>
									<NumberValue
										value={gasPrice}
									/>
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
							sources: selection.sources,
							fields: {
								effectiveGasPrice: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const effectiveGasPrice = resolvedEntity.effectiveGasPrice}
						{#if effectiveGasPrice !== undefined && effectiveGasPrice !== null}
							<div>
								<dt>Effective gas price</dt>
								<dd>
									<NumberValue
										value={effectiveGasPrice}
									/>
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
							resource={projection.maxFeePerGas}
						>
							{#snippet children(maxFeePerGas)}
								{#if maxFeePerGas !== undefined && maxFeePerGas !== null}
									<div>
										<dt>Max fee</dt>
										<dd>
											<NumberValue
												value={maxFeePerGas}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}

					{#if contentOpen}
						<ResourceBoundary
							resource={projection.maxPriorityFeePerGas}
						>
							{#snippet children(maxPriorityFeePerGas)}
								{#if maxPriorityFeePerGas !== undefined && maxPriorityFeePerGas !== null}
									<div>
										<dt>Priority fee</dt>
										<dd>
											<NumberValue
												value={maxPriorityFeePerGas}
											/>
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
							sources: selection.sources,
							fields: {
								cumulativeGasUsed: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const cumulativeGasUsed = resolvedEntity.cumulativeGasUsed}
						{#if cumulativeGasUsed !== undefined && cumulativeGasUsed !== null}
							<div>
								<dt>Cumulative gas used</dt>
								<dd>
									<NumberValue
										value={cumulativeGasUsed}
									/>
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
									sources: selection.sources,
									fields: {
										envelopeType: true,
									},
								})
							}
						>
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
							sources: selection.sources,
							fields: {
								nonce: true,
							},
						})
					}
				>
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
							sources: selection.sources,
							fields: {
								indexInBlock: true,
							},
						})
					}
				>
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
							sources: selection.sources,
							fields: {
								input: true,
							},
						})
					}
				>
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
							sources: selection.sources,
							fields: {
								r: true,
							},
						})
					}
				>
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
							sources: selection.sources,
							fields: {
								s: true,
							},
						})
					}
				>
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
							sources: selection.sources,
							fields: {
								v: true,
							},
						})
					}
				>
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
							resource={projection.blobGasUsed}
						>
							{#snippet children(blobGasUsed)}
								{#if blobGasUsed !== undefined && blobGasUsed !== null}
									<div>
										<dt>Blob gas used</dt>
										<dd>
											<NumberValue
												value={blobGasUsed}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}

					{#if contentOpen}
						<ResourceBoundary
							resource={projection.maxFeePerBlobGas}
						>
							{#snippet children(maxFeePerBlobGas)}
								{#if maxFeePerBlobGas !== undefined && maxFeePerBlobGas !== null}
									<div>
										<dt>Max fee per blob gas</dt>
										<dd>
											<NumberValue
												value={maxFeePerBlobGas}
											/>
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
		<CollapsibleTabs
			id={viewDomId + '-carousel-evm-tx-transfers'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'evm-tx-token-transfers',
						label: 'Token transfers',
						ownsSection: true,
					},
					{
						id: 'evm-tx-internal-transfers',
						label: 'Internal transfers',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-transfers'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Transfers</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerEvmTxTokenTransfers(_context, Content)}
				{@const evmTxTransfersEvmTxTokenTransfersResource = selection.$$tokenTransfers}
				<ResourceBoundary
					resource={evmTxTransfersEvmTxTokenTransfersResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionEvmTxTokenTransfers({ id, label, open, active })}
				{@const evmTxTransfersEvmTxTokenTransfersResource = selection.$$tokenTransfers}
				<ResourceBoundary
					resource={evmTxTransfersEvmTxTokenTransfersResource}
				>
					{#snippet children(evmTokenTransfer)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<EvmTokenTransfersView
								selection={evmTxTransfersEvmTxTokenTransfersResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No token transfers.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerEvmTxInternalTransfers(_context, Content)}
				{@const evmTxTransfersEvmTxInternalTransfersResource = selection.$$internalTransfers}
				<ResourceBoundary
					resource={evmTxTransfersEvmTxInternalTransfersResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionEvmTxInternalTransfers({ id, label, open, active })}
				{@const evmTxTransfersEvmTxInternalTransfersResource = selection.$$internalTransfers}
				<ResourceBoundary
					resource={evmTxTransfersEvmTxInternalTransfersResource}
				>
					{#snippet children(evmInternalTransfer)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<EvmInternalTransfersView
								selection={evmTxTransfersEvmTxInternalTransfersResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No internal transfers.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
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
						ownsSection: true,
					},
					{
						id: 'evm-tx-traces',
						label: 'Traces',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-execution'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Execution</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerEvmTxLogs(_context, Content)}
				{@const evmTxExecutionEvmTxLogsResource = selection.$$logs}
				<ResourceBoundary
					resource={evmTxExecutionEvmTxLogsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionEvmTxLogs({ id, label, open, active })}
				{@const evmTxExecutionEvmTxLogsResource = selection.$$logs}
				<ResourceBoundary
					resource={evmTxExecutionEvmTxLogsResource}
				>
					{#snippet children(evmLog)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<EvmLogsView
								selection={evmTxExecutionEvmTxLogsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No logs.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerEvmTxTraces(_context, Content)}
				{@const evmTxExecutionEvmTxTracesResource = selection.$$traces}
				<ResourceBoundary
					resource={evmTxExecutionEvmTxTracesResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionEvmTxTraces({ id, label, open, active })}
				{@const evmTxExecutionEvmTxTracesResource = selection.$$traces}
				<ResourceBoundary
					resource={evmTxExecutionEvmTxTracesResource}
				>
					{#snippet children(evmTrace)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<EvmTracesView
								selection={evmTxExecutionEvmTxTracesResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No traces.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
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
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-account-abstraction'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Account abstraction</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerEvmTxUserOperations(_context, Content)}
				{@const evmTxAccountAbstractionEvmTxUserOperationsResource = selection.$$userOperations}
				<ResourceBoundary
					resource={evmTxAccountAbstractionEvmTxUserOperationsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionEvmTxUserOperations({ id, label, open, active })}
				{@const evmTxAccountAbstractionEvmTxUserOperationsResource = selection.$$userOperations}
				<ResourceBoundary
					resource={evmTxAccountAbstractionEvmTxUserOperationsResource}
				>
					{#snippet children(evmUserOperation)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<EvmUserOperationsView
								selection={evmTxAccountAbstractionEvmTxUserOperationsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No user operations.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>

		<ProjectionBoundary
			resource={selection.Blob}
		>
			{#snippet Applicable(projection)}
				<CollapsibleTabs
					id={viewDomId + '-carousel-evm-tx-blobs'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'evm-tx-blobs',
								label: 'Blobs',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-execution'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Blobs</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerEvmTxBlobs(_context, Content)}
						{@const evmTxBlobsEvmTxBlobsResource = projection.$$blobs}
						<ResourceBoundary
							resource={evmTxBlobsEvmTxBlobsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionEvmTxBlobs({ id, label, open, active })}
						{@const evmTxBlobsEvmTxBlobsResource = projection.$$blobs}
						<ResourceBoundary
							resource={evmTxBlobsEvmTxBlobsResource}
						>
							{#snippet children(evmBlob)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<EvmBlobsView
										selection={evmTxBlobsEvmTxBlobsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No blobs.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.SetCode}
		>
			{#snippet Applicable(projection)}
				<CollapsibleTabs
					id={viewDomId + '-carousel-evm-tx-authorizations'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'evm-tx-authorizations',
								label: 'Authorizations',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-account-abstraction'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Authorizations</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerEvmTxAuthorizations(_context, Content)}
						{@const evmTxAuthorizationsEvmTxAuthorizationsResource = projection.$$authorizations}
						<ResourceBoundary
							resource={evmTxAuthorizationsEvmTxAuthorizationsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionEvmTxAuthorizations({ id, label, open, active })}
						{@const evmTxAuthorizationsEvmTxAuthorizationsResource = projection.$$authorizations}
						<ResourceBoundary
							resource={evmTxAuthorizationsEvmTxAuthorizationsResource}
						>
							{#snippet children(eip7702Authorization)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<Eip7702AuthorizationsView
										selection={evmTxAuthorizationsEvmTxAuthorizationsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No authorizations.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntityView>
