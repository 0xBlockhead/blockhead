<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
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
	}: EntitySelectionViewProps<EntityType.EvmLog> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockscout_Rest,
		],
	}))
	const evmLog = $derived(viewSelection({
		fields: {
			data: true,
		},
	}))
	const titleFallback = $derived((String(pendingEntity.indexInTransaction ?? '') ? 'Log #' + String(pendingEntity.indexInTransaction ?? '') : '') || 'EVM log')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmLog}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInTransaction ?? '')}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]',
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
		<ResourceBoundary
			resource={selection.$emitter}
		>
			{#snippet children(evmContract)}
				{#if evmContract != null}
					<EvmContractView
						selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
						prefetched={evmContract}
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<span>#</span>
		{String(pendingEntity.indexInTransaction)}
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{String(pendingEntity.indexInTransaction)}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			An event log emitted by an EVM transaction receipt.
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
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			<ResourceBoundary
				resource={selection.$emitter}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Emitter contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
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
			<ResourceBoundary
				resource={evmLog}
			>
				{#snippet children(entity)}
					{@const data = entity.data}
					{#if data != null}
						<div>
							<dt>Data</dt>
							<dd>
								<TruncatedValue value={String(data)} />
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
								removed: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const removed = entity.removed}
						{#if removed != null}
							<div>
								<dt>Removed</dt>
								<dd>
									{removed ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const evmLogEvmTopicsViewTopicsResource = selection.$$topics}
		<ResourceBoundary
			resource={evmLogEvmTopicsViewTopicsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmTopicsView
						selection={evmLogEvmTopicsViewTopicsResource}
						countResource={evmLogEvmTopicsViewTopicsResource.count}
						title='Topics'
						id='topics'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ProjectionBoundary
			resource={selection.Event.TokenTransfer}
		>
			{#snippet Applicable(projection)}
				{@const evmLogEvmTokenTransfersViewEventTokenTransferTokenTransfersResource = projection.$$tokenTransfers}
				<ResourceBoundary
					resource={evmLogEvmTokenTransfersViewEventTokenTransferTokenTransfersResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
							<EvmTokenTransfersView
								selection={evmLogEvmTokenTransfersViewEventTokenTransferTokenTransfersResource}
								countResource={evmLogEvmTokenTransfersViewEventTokenTransferTokenTransfersResource.count}
								title='Token transfers'
								id='token-transfers'
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntityView>
