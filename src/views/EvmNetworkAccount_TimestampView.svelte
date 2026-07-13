<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkAccount_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmNetworkAccount_Timestamp>>
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
	const evmNetworkAccountTimestamp = $derived(selection({
		fields: {
			transactionCount: true,
		},
	}))
	const titleFallback = $derived('EVM network account timestamp')
	const viewDomId = $derived('evm-network-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkAccount_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmNetworkAccountTimestamp}>
			{#snippet Pending()}
				<EvmNetworkAccountView
					selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EvmNetworkAccountView
					selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkAccountTimestamp}>
			{#snippet Pending()}
				{@const transactionCount0 = pendingEntity.transactionCount}
				{#if transactionCount0 !== undefined && transactionCount0 !== null}
					<NumberValue value={Number(transactionCount0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const transactionCount0 = resolvedEntity.transactionCount}
				{#if transactionCount0 !== undefined && transactionCount0 !== null}
					<NumberValue value={Number(transactionCount0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmNetworkAccountTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockNumber = pendingEntity.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								{String((blockNumber) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockNumber = resolvedEntity.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								{String((blockNumber) ?? '')}
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
							transactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionCount = pendingEntity.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>transaction count</dt>
							<dd>
								{String((transactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionCount = resolvedEntity.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>transaction count</dt>
							<dd>
								{String((transactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenTransferCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenTransferCount = pendingEntity.tokenTransferCount}
					{#if tokenTransferCount !== undefined && tokenTransferCount !== null}
						<div>
							<dt>token transfer count</dt>
							<dd>
								{String((tokenTransferCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenTransferCount = resolvedEntity.tokenTransferCount}
					{#if tokenTransferCount !== undefined && tokenTransferCount !== null}
						<div>
							<dt>token transfer count</dt>
							<dd>
								{String((tokenTransferCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							internalTransferCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const internalTransferCount = pendingEntity.internalTransferCount}
					{#if internalTransferCount !== undefined && internalTransferCount !== null}
						<div>
							<dt>internal transfer count</dt>
							<dd>
								{String((internalTransferCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const internalTransferCount = resolvedEntity.internalTransferCount}
					{#if internalTransferCount !== undefined && internalTransferCount !== null}
						<div>
							<dt>internal transfer count</dt>
							<dd>
								{String((internalTransferCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nftCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nftCount = pendingEntity.nftCount}
					{#if nftCount !== undefined && nftCount !== null}
						<div>
							<dt>NFT count</dt>
							<dd>
								{String((nftCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nftCount = resolvedEntity.nftCount}
					{#if nftCount !== undefined && nftCount !== null}
						<div>
							<dt>NFT count</dt>
							<dd>
								{String((nftCount) ?? '')}
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
							firstTransactionAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const firstTransactionAt = pendingEntity.firstTransactionAt}
					{#if firstTransactionAt !== undefined && firstTransactionAt !== null}
						<div>
							<dt>first transaction AT</dt>
							<dd>
								<Timestamp timestamp={Number(firstTransactionAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const firstTransactionAt = resolvedEntity.firstTransactionAt}
					{#if firstTransactionAt !== undefined && firstTransactionAt !== null}
						<div>
							<dt>first transaction AT</dt>
							<dd>
								<Timestamp timestamp={Number(firstTransactionAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastTransactionAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastTransactionAt = pendingEntity.lastTransactionAt}
					{#if lastTransactionAt !== undefined && lastTransactionAt !== null}
						<div>
							<dt>last transaction AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastTransactionAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastTransactionAt = resolvedEntity.lastTransactionAt}
					{#if lastTransactionAt !== undefined && lastTransactionAt !== null}
						<div>
							<dt>last transaction AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastTransactionAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isContract: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isContract = pendingEntity.isContract}
					{#if isContract !== undefined && isContract !== null}
						<div>
							<dt>is contract</dt>
							<dd>
								{isContract ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isContract = resolvedEntity.isContract}
					{#if isContract !== undefined && isContract !== null}
						<div>
							<dt>is contract</dt>
							<dd>
								{isContract ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
