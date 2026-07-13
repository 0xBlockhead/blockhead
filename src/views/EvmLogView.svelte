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
			selection: EntityProxyResource<typeof schema, EntityType.EvmLog>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmLog>>
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
	const evmLog = $derived(selection({
		sources: [
			Source.Blockscout_Rest,
		],
		fields: {
			$emitter: true,
			$$topics: true,
			data: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.indexInTransaction) ?? '') ? 'Log #' + String((pendingEntity.indexInTransaction) ?? '') : '') || 'EVM log')
	const viewDomId = $derived('evm-log-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.$transaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.slug !== undefined && pendingEntity.$transaction.txHash !== undefined && pendingEntity.indexInTransaction !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]', {
			network: String(pendingEntity.$transaction.$network.slug ?? ''),
			transactionId: String(pendingEntity.$transaction.txHash ?? ''),
			indexInTransaction: String(pendingEntity.indexInTransaction ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmLog}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$emitter}
				>
					{#snippet children(evmContract)}
						{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
							<EvmContractView
								selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
								prefetched={evmContract}
								href={
									(evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.slug !== undefined && evmContract[EntityMetaKey.Selector].address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
										network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
										address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const indexInTransaction1 = pendingEntity.indexInTransaction}
				{#if indexInTransaction1 !== undefined && indexInTransaction1 !== null}
					<span>#</span>
					{String((indexInTransaction1) ?? '')}
				{/if}
			{/snippet}

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
								href={
									(evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.slug !== undefined && evmContract[EntityMetaKey.Selector].address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
										network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
										address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
									}) : undefined)
								}
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
								fields: {
									indexInTransaction: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInTransaction = pendingEntity.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<span>#</span>
								{String((indexInTransaction) ?? '')}
							{/if}
						{/snippet}

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
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$transaction, {})}
						href={
							(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined && selection.entitySelector.$transaction.txHash !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
								network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
								transactionId: String(selection.entitySelector.$transaction.txHash ?? ''),
							}) : undefined)
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
			{/if}

			<ResourceBoundary
				resource={selection.$emitter}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Emitter contract</dt>
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							data: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const data = pendingEntity.data}
					{#if data !== undefined && data !== null}
						<div>
							<dt>Data</dt>
							<dd>
								<TruncatedValue value={String((data) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
							fields: {
								removed: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const removed = pendingEntity.removed}
						{#if removed !== undefined && removed !== null}
							<div>
								<dt>Removed</dt>
								<dd>
									{removed ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}

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
		{#if detailsOpen}
			<EvmTopicsView
				selection={
						selection.$$topics({
							count: true,
						})
					}
				title='Topics'
				href={resolve('/evm/topics')}
				id='EvmTopicsView-topics'
			/>

			<ProjectionBoundary
				resource={selection.Event.TokenTransfer}
			>
				{#snippet Applicable(projection)}
					<EvmTokenTransfersView
						selection={
							projection.$$tokenTransfers({
								count: true,
							})
						}
						title='Token transfers'
						id='EvmTokenTransfersView-token-transfers'
					/>
				{/snippet}
			</ProjectionBoundary>
		{/if}
	{/snippet}
</EntityView>
