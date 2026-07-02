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
			selection: EntityProxyResource<typeof schema, EntityType.EvmBlock>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmBlock>>
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

	const evmBlock = $derived(selection({
		sources: [
			Source.Voltaire_JsonRpc,
		],
		fields: {
			timestamp: true,
			transactionCount: true,
			...(open && {
				parentHash: true,
				$parent: true,
				$miner: true,
				gasUsed: true,
				gasLimit: true,
				baseFeePerGas: true,
				blobGasUsed: true,
				excessBlobGas: true,
				$$transactions: true,
			}),
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).blockNumber) ?? '') ? 'Block #' + String((({ ...selection.entitySelector, ...prefetched }).blockNumber) ?? '') : '') || [String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ') || 'EVM block')
	const viewDomId = $derived('evm-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
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
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).blockNumber ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			blockNumber: String(({ ...selection.entitySelector, ...prefetched }).blockNumber),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).blockNumber}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Block </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{:else}
			{[String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).blockNumber}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{:else}
			{[String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
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
					<ResourceBoundary resource={evmBlock}>
						{#snippet Pending()}
							{@const hash = prefetched.hash ?? selection.entitySelector.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String(hash)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const hash = entity.hash ?? selection.entitySelector.hash ?? prefetched.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String(hash)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={evmBlock}>
				{#snippet Pending()}
					{@const transactionCount = prefetched.transactionCount ?? selection.entitySelector.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>Transactions</dt>
							<dd>
								<NumberValue value={Number(transactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount ?? selection.entitySelector.transactionCount ?? prefetched.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>Transactions</dt>
							<dd>
								<NumberValue value={Number(transactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmBlock}>
				{#snippet Pending()}
					{@const timestamp = prefetched.timestamp ?? selection.entitySelector.timestamp}
					{#if timestamp !== undefined && timestamp !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestamp)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestamp = entity.timestamp ?? selection.entitySelector.timestamp ?? prefetched.timestamp}
					{#if timestamp !== undefined && timestamp !== null}
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
				<ResourceBoundary resource={evmBlock}>
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
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmBlock}>
					{#snippet Pending()}
						{@const gasLimit = prefetched.gasLimit ?? selection.entitySelector.gasLimit}
						{#if gasLimit !== undefined && gasLimit !== null}
							<div>
								<dt>Gas limit</dt>
								<dd>
									<NumberValue value={Number(gasLimit)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const gasLimit = entity.gasLimit ?? selection.entitySelector.gasLimit ?? prefetched.gasLimit}
						{#if gasLimit !== undefined && gasLimit !== null}
							<div>
								<dt>Gas limit</dt>
								<dd>
									<NumberValue value={Number(gasLimit)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmBlock}>
					{#snippet Pending()}
						{@const baseFeePerGas = prefetched.baseFeePerGas ?? selection.entitySelector.baseFeePerGas}
						{#if baseFeePerGas !== undefined && baseFeePerGas !== null}
							<div>
								<dt>Base fee</dt>
								<dd>
									<NumberValue value={Number(baseFeePerGas)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const baseFeePerGas = entity.baseFeePerGas ?? selection.entitySelector.baseFeePerGas ?? prefetched.baseFeePerGas}
						{#if baseFeePerGas !== undefined && baseFeePerGas !== null}
							<div>
								<dt>Base fee</dt>
								<dd>
									<NumberValue value={Number(baseFeePerGas)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmBlock}>
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
				<ResourceBoundary resource={evmBlock}>
					{#snippet Pending()}
						{@const excessBlobGas = prefetched.excessBlobGas ?? selection.entitySelector.excessBlobGas}
						{#if excessBlobGas !== undefined && excessBlobGas !== null}
							<div>
								<dt>Excess blob gas</dt>
								<dd>
									<NumberValue value={Number(excessBlobGas)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const excessBlobGas = entity.excessBlobGas ?? selection.entitySelector.excessBlobGas ?? prefetched.excessBlobGas}
						{#if excessBlobGas !== undefined && excessBlobGas !== null}
							<div>
								<dt>Excess blob gas</dt>
								<dd>
									<NumberValue value={Number(excessBlobGas)} />
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
					resource={selection[EntityProxyField]<EntityType.EvmBlock, false>('$parent')}
				>
					{#snippet children(evmBlock)}
						{#if evmBlock != null}
							<div>
								<dt>Parent block</dt>
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

			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$miner')}
				>
					{#snippet children(evmAccount)}
						{#if evmAccount != null}
							<div>
								<dt>Miner / validator</dt>
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
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EvmTransactionsView
				selection={selection[EntityProxyField]<EntityType.EvmTransaction>('$$transactions')}
				title='Transactions'
				emptyText='No transactions in this block.'
				id='EvmTransactionsView-$$transactions'
			/>
		{/if}
	{/snippet}
</EntityView>
