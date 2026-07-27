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
	}: EntitySelectionViewProps<EntityType.EvmBlock> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.SqdPortal_RawHttp,
			Source.Voltaire_JsonRpc,
		],
	}))
	const evmBlock = $derived(viewSelection({
		fields: {
			blockNumber: true,
			hash: true,
			timestamp: true,
			transactionCount: true,
		},
	}))
	const titleFallback = $derived((String(pendingEntity.blockNumber ?? '') ? 'Block #' + String(pendingEntity.blockNumber ?? '') : '') || String(pendingEntity.hash ?? '') || 'EVM block')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlock}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.blockNumber ?? '')}
	href={
		href ?? (
			'blockNumber' in selection.entitySelector ?
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
					{
						network: (
							'caip2' in selection.entitySelector.$network ?
								String(caip2StringFromValue(selection.entitySelector.$network.caip2))
							:
								String(selection.entitySelector.$network.slug)
						),
						blockNumber: String(selection.entitySelector.blockNumber),
					}
				)
			:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Block </span>
			<span data-badge="small">
				#{String(pendingEntity.blockNumber)}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{String(pendingEntity.blockNumber)}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A block in an EVM-compatible execution chain.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={evmBlock}
					>
						{#snippet children(entity)}
							<TruncatedValue value={String(entity.hash)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={evmBlock}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>Transactions</dt>
							<dd>
								<NumberValue
									value={transactionCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={evmBlock}
			>
				{#snippet children(entity)}
					{@const timestamp = entity.timestamp}
					{#if timestamp != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestamp)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								gasUsed: true,
							},
						})
					}
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
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								gasLimit: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const gasLimit = entity.gasLimit}
						{#if gasLimit != null}
							<div>
								<dt>Gas limit</dt>
								<dd>
									<NumberValue
										value={gasLimit}
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
								baseFeePerGas: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const baseFeePerGas = entity.baseFeePerGas}
						{#if baseFeePerGas != null}
							<div>
								<dt>Base fee</dt>
								<dd>
									<NumberValue
										value={baseFeePerGas}
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
								blobGasUsed: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const blobGasUsed = entity.blobGasUsed}
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
					resource={
						viewSelection({
							fields: {
								excessBlobGas: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const excessBlobGas = entity.excessBlobGas}
						{#if excessBlobGas != null}
							<div>
								<dt>Excess blob gas</dt>
								<dd>
									<NumberValue
										value={excessBlobGas}
									/>
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
					resource={selection.$parent}
				>
					{#snippet children(evmBlock)}
						{#if evmBlock != null}
							<div>
								<dt>Parent block</dt>
								<dd>
									<EvmBlockView
										selection={select(EntityType.EvmBlock, evmBlock[EntityMetaKey.Selector])}
										prefetched={evmBlock}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$miner}
				>
					{#snippet children(evmAccount)}
						{#if evmAccount != null}
							<div>
								<dt>Miner / validator</dt>
								<dd>
									<EvmAccountView
										selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
										prefetched={evmAccount}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const evmBlockEvmTransactionsViewTransactionsResource = selection.$$transactions}
		<ResourceBoundary
			resource={evmBlockEvmTransactionsViewTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmTransactionsView
						selection={evmBlockEvmTransactionsViewTransactionsResource}
						countResource={evmBlockEvmTransactionsViewTransactionsResource.count}
						title='Transactions'
						id='transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
