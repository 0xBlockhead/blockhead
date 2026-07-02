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

	const evmLog = $derived(selection({
		sources: [
			Source.Blockscout_Rest,
		],
		fields: {
			$emitter: true,
			$$topics: true,
			data: true,
			...(open && {
				$block: true,
				removed: true,
				$$tokenTransfers: true,
			}),
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') ? 'Log #' + String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') : '') || 'EVM log')
	const viewDomId = $derived('evm-log-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
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
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/log/[indexInTransaction=nonNegativeInteger]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2.reference)}`,
			transactionId: String(({ ...selection.entitySelector, ...prefetched }).$transaction.txHash),
			indexInTransaction: String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$emitter')}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
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
					{/if}
				{/snippet}
			</ResourceBoundary>
			{@const indexInTransaction1 = ({ ...selection.entitySelector, ...prefetched }).indexInTransaction}
			{#if indexInTransaction1 !== undefined && indexInTransaction1 !== null}
				<span>#</span>
				{String((indexInTransaction1) ?? '')}
			{/if}
		{:else}
			<ResourceBoundary resource={evmLog}>
				{#snippet Pending()}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$emitter')}
					>
						{#snippet children(evmContract)}
							{#if evmContract != null}
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
							{/if}
						{/snippet}
					</ResourceBoundary>
					{@const indexInTransaction1 = ({ ...selection.entitySelector, ...prefetched }).indexInTransaction}
					{#if indexInTransaction1 !== undefined && indexInTransaction1 !== null}
						<span>#</span>
						{String((indexInTransaction1) ?? '')}
					{/if}
				{/snippet}

				{#snippet children(entity)}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$emitter')}
					>
						{#snippet children(evmContract)}
							{#if evmContract != null}
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
							{/if}
						{/snippet}
					</ResourceBoundary>
					{@const indexInTransaction1 = ({ ...selection.entitySelector, ...prefetched, ...entity }).indexInTransaction}
					{#if indexInTransaction1 !== undefined && indexInTransaction1 !== null}
						<span>#</span>
						{String((indexInTransaction1) ?? '')}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInTransaction}
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
				<dt>Transaction</dt>
				<dd>
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$transaction)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${String(selection.entitySelector.$transaction.$network.caip2.namespace)}:${String(selection.entitySelector.$transaction.$network.caip2.reference)}`,
								transactionId: String(selection.entitySelector.$transaction.txHash),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			{#if contentOpen}
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
			{/if}
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={evmLog}>
				{#snippet Pending()}
					{@const data = prefetched.data ?? selection.entitySelector.data}
					{#if data !== undefined && data !== null}
						<div>
							<dt>Data</dt>
							<dd>
								<TruncatedValue value={String(data)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const data = entity.data ?? selection.entitySelector.data ?? prefetched.data}
					{#if data !== undefined && data !== null}
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
				<ResourceBoundary resource={evmLog}>
					{#snippet Pending()}
						{@const removed = prefetched.removed ?? selection.entitySelector.removed}
						{#if removed !== undefined && removed !== null}
							<div>
								<dt>Removed</dt>
								<dd>
									{String((removed) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const removed = entity.removed ?? selection.entitySelector.removed ?? prefetched.removed}
						{#if removed !== undefined && removed !== null}
							<div>
								<dt>Removed</dt>
								<dd>
									{String((removed) ?? '')}
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
				selection={selection[EntityProxyField]<EntityType.EvmTopic>('$$topics')}
				title='Topics'
				href={resolve('/(explore)/(evm)/evm/(topics)/topics')}
				id='EvmTopicsView-$$topics'
			/>

			<EvmTokenTransfersView
				selection={selection[EntityProxyField]<EntityType.EvmTokenTransfer>('$$tokenTransfers')}
				title='Token transfers'
				id='EvmTokenTransfersView-$$tokenTransfers'
			/>
		{/if}
	{/snippet}
</EntityView>
