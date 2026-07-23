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
			selection: RegisteredEntityProxyResource<EntityType.EvmLog>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EvmLog>
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
	const evmLog = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
		fields: {
			data: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.indexInTransaction) ?? '') ? 'Log #' + String((pendingEntity.indexInTransaction) ?? '') : '') || 'EVM log')
	const viewDomId = $derived('evm-log-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInTransaction ?? '')}
	href={
		href ?? (
			selection.entitySelector != null && 'indexInTransaction' in selection.entitySelector
			&& selection.entitySelector.indexInTransaction != null
			&& selection.entitySelector != null && '$transaction' in selection.entitySelector
			&& selection.entitySelector.$transaction != null && 'txHash' in selection.entitySelector.$transaction
			&& selection.entitySelector.$transaction.txHash != null
			&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction ?
				selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
				&& selection.entitySelector.$transaction.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]', {
				indexInTransaction: String(selection.entitySelector.indexInTransaction ?? ''),
				transactionId: String(selection.entitySelector.$transaction.txHash ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
					&& selection.entitySelector.$transaction.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]', {
					indexInTransaction: String(selection.entitySelector.indexInTransaction ?? ''),
					transactionId: String(selection.entitySelector.$transaction.txHash ?? ''),
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
		<ResourceBoundary resource={evmLog}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$emitter}
				>
					{#snippet children(evmContract)}
						{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
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
				{@const indexInTransaction1 = resolvedEntity.indexInTransaction}
				{#if indexInTransaction1 !== undefined && indexInTransaction1 !== null}
					<span>#</span>
					{String((indexInTransaction1) ?? '')}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{@const serialValue = pendingEntity.indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
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
				<dt>Transaction</dt>
				<dd>
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$transaction)}
						href={
							(
								selection.entitySelector.$transaction != null && 'txHash' in selection.entitySelector.$transaction
								&& selection.entitySelector.$transaction.txHash != null
								&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction ?
									selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
									&& selection.entitySelector.$transaction.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
									transactionId: String(selection.entitySelector.$transaction.txHash ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
										&& selection.entitySelector.$transaction.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
										transactionId: String(selection.entitySelector.$transaction.txHash ?? ''),
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

			{#if contentOpen}
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
			{/if}

			<ResourceBoundary
				resource={selection.$emitter}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Emitter contract</dt>
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							data: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const data = resolvedEntity.data}
					{#if data !== undefined && data !== null}
						<div>
							<dt>Data</dt>
							<dd>
								<TruncatedValue value={String((data) ?? '')} />
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
								removed: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const removed = resolvedEntity.removed}
						{#if removed !== undefined && removed !== null}
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
					id='EvmTopicsView-topics'
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
							id='EvmTokenTransfersView-token-transfers'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntityView>
