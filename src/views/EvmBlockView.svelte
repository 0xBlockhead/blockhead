<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.EvmBlock>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmBlock>>
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
	const evmBlock = $derived(selection({
		sources: [
			Source.SqdPortal_RawHttp,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			timestamp: true,
			transactionCount: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.blockNumber) ?? '') ? 'Block #' + String((pendingEntity.blockNumber) ?? '') : '') || [String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ') || 'EVM block')
	const viewDomId = $derived('evm-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.blockNumber ?? '')}
	href={
		href ?? (pendingEntity.blockNumber !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
			blockNumber: String(pendingEntity.blockNumber ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.blockNumber !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
			blockNumber: String(pendingEntity.blockNumber ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.blockNumber}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Block </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{:else}
			{[String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = pendingEntity.blockNumber}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{:else}
			{[String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ')}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const hash = pendingEntity.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const hash = resolvedEntity.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionCount = pendingEntity.transactionCount}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionCount = resolvedEntity.transactionCount}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestamp = pendingEntity.timestamp}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestamp = resolvedEntity.timestamp}
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
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								gasLimit: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const gasLimit = pendingEntity.gasLimit}
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
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const gasLimit = resolvedEntity.gasLimit}
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
				<ResourceBoundary
					resource={
						selection({
							fields: {
								baseFeePerGas: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const baseFeePerGas = pendingEntity.baseFeePerGas}
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
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const baseFeePerGas = resolvedEntity.baseFeePerGas}
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
				<ResourceBoundary
					resource={
						selection({
							fields: {
								blobGasUsed: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const blobGasUsed = pendingEntity.blobGasUsed}
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
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const blobGasUsed = resolvedEntity.blobGasUsed}
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
				<ResourceBoundary
					resource={
						selection({
							fields: {
								excessBlobGas: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const excessBlobGas = pendingEntity.excessBlobGas}
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
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const excessBlobGas = resolvedEntity.excessBlobGas}
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
					resource={selection.$parent}
				>
					{#snippet Pending()}{/snippet}

					{#snippet children(evmBlock)}
						{#if evmBlock != null && evmBlock[EntityMetaKey.Selector] != null}
							<div>
								<dt>Parent block</dt>
								<dd>
									<EvmBlockView
										selection={select(EntityType.EvmBlock, evmBlock[EntityMetaKey.Selector])}
										prefetched={evmBlock}
										href={
											(evmBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
												blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
												network: String(caip2StringFromValue(evmBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
											}) : evmBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
												blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
												network: String(evmBlock[EntityMetaKey.Selector].$network.slug ?? ''),
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

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$miner}
				>
					{#snippet Pending()}{/snippet}

					{#snippet children(evmAccount)}
						{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
							<div>
								<dt>Miner / validator</dt>
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
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EvmTransactionsView
				selection={
						selection.$$transactions({
							count: true,
						})
					}
				title='Transactions'
				emptyText='No transactions in this block.'
				id='EvmTransactionsView-transactions'
			/>
		{/if}
	{/snippet}
</EntityView>
