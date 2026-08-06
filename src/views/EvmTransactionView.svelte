<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EvmTransaction>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockscout_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const evmTransaction = $derived(viewSelection({
		fields: {
			kind: true,
			value: true,
			executionStatus: true,
			gasUsed: true,
		},
	}))
	const viewDomId = $derived('evm-transaction-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.txHash || 'EVM transaction')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					transactionId: selection.entitySelector.txHash,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<IconComponent />
	{/snippet}

	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.txHash} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.txHash} />
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null}
						<div>
							<dt>Block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, evmBlock[EntityMetaKey.Selector])}
									prefetched={evmBlock}
									layout={EntityLayout.Value}
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
							<EvmAccountView
								selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
							{#if evmContract != null}
								<div>
									<dt>Created contract</dt>
									<dd>
										<EvmContractView
											selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
											prefetched={evmContract}
											layout={EntityLayout.Value}
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
						resource={evmTransaction}
					>
						{#snippet children(entity)}
							{entity.kind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Value</dt>
				<dd>
					<ResourceBoundary
						resource={evmTransaction}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={evmTransaction}
			>
				{#snippet children(entity)}
					{@const executionStatus = entity.executionStatus}
					{#if executionStatus != null}
						<div>
							<dt>Status</dt>
							<dd>
								{executionStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={evmTransaction}
			>
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
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
						viewSelection({
							fields: {
								gas: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const gas = entity.gas}
						{#if gas != null}
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
						viewSelection({
							fields: {
								gasPrice: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const gasPrice = entity.gasPrice}
						{#if gasPrice != null}
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
						viewSelection({
							fields: {
								effectiveGasPrice: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const effectiveGasPrice = entity.effectiveGasPrice}
						{#if effectiveGasPrice != null}
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
								{#if maxFeePerGas != null}
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
								{#if maxPriorityFeePerGas != null}
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
						viewSelection({
							fields: {
								cumulativeGasUsed: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const cumulativeGasUsed = entity.cumulativeGasUsed}
						{#if cumulativeGasUsed != null}
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
								viewSelection({
									fields: {
										envelopeType: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{entity.envelopeType}
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
								nonce: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const nonce = entity.nonce}
						{#if nonce != null}
							<div>
								<dt>Nonce</dt>
								<dd>
									{nonce}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								indexInBlock: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const indexInBlock = entity.indexInBlock}
						{#if indexInBlock != null}
							<div>
								<dt>Index in block</dt>
								<dd>
									{indexInBlock}
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
						viewSelection({
							fields: {
								input: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const input = entity.input}
						{#if input != null}
							<div>
								<dt>Input data</dt>
								<dd>
									<TruncatedValue value={input} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								r: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const r = entity.r}
						{#if r != null}
							<div>
								<dt>Signature r</dt>
								<dd>
									<TruncatedValue value={r} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								s: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const s = entity.s}
						{#if s != null}
							<div>
								<dt>Signature s</dt>
								<dd>
									<TruncatedValue value={s} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								v: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const v = entity.v}
						{#if v != null}
							<div>
								<dt>Signature v</dt>
								<dd>
									{v}
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
								{#if blobGasUsed != null}
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
								{#if maxFeePerBlobGas != null}
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

	{#snippet Details()}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Transfers</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEvmTxTokenTransfers({ id, label })}
				<EvmTokenTransfersView
					selection={selection.$$tokenTransfers}
					collapsible={false}
					title={label}
					emptyText='No token transfers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmTxInternalTransfers({ id, label })}
				<EvmInternalTransfersView
					selection={selection.$$internalTransfers}
					collapsible={false}
					title={label}
					emptyText='No internal transfers.'
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

			{#snippet SectionEvmTxLogs({ id, label })}
				<EvmLogsView
					selection={selection.$$logs}
					collapsible={false}
					title={label}
					emptyText='No logs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmTxTraces({ id, label })}
				<EvmTracesView
					selection={selection.$$traces}
					collapsible={false}
					title={label}
					emptyText='No traces.'
					id={`${id}-list`}
				/>
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

			{#snippet SectionEvmTxUserOperations({ id, label })}
				<EvmUserOperationsView
					selection={selection.$$userOperations}
					collapsible={false}
					title={label}
					emptyText='No user operations.'
					id={`${id}-list`}
				/>
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

					{#snippet SectionEvmTxBlobs({ id, label })}
						<EvmBlobsView
							selection={projection.$$blobs}
							collapsible={false}
							title={label}
							emptyText='No blobs.'
							id={`${id}-list`}
						/>
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

					{#snippet SectionEvmTxAuthorizations({ id, label })}
						<Eip7702AuthorizationsView
							selection={projection.$$authorizations}
							collapsible={false}
							title={label}
							emptyText='No authorizations.'
							id={`${id}-list`}
						/>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntityView>
