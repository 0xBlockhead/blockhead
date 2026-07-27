<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmNetworkAccount_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const evmNetworkAccountTimestamp = $derived(selection({
		fields: {
			transactionCount: true,
		},
	}))
	const titleFallback = 'EVM network account timestamp'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EvmNetworkAccountView
			selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkAccountTimestamp}>
			{#snippet children(entity)}
				{@const transactionCount0 = entity.transactionCount}
				{#if transactionCount0 != null}
					<NumberValue
						value={transactionCount0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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
				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber}
					{#if blockNumber != null}
						<div>
							<dt>Block number</dt>
							<dd>
								{String(blockNumber)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={evmNetworkAccountTimestamp}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>transaction count</dt>
							<dd>
								{String(transactionCount)}
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
				{#snippet children(entity)}
					{@const tokenTransferCount = entity.tokenTransferCount}
					{#if tokenTransferCount != null}
						<div>
							<dt>token transfer count</dt>
							<dd>
								{String(tokenTransferCount)}
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
				{#snippet children(entity)}
					{@const internalTransferCount = entity.internalTransferCount}
					{#if internalTransferCount != null}
						<div>
							<dt>internal transfer count</dt>
							<dd>
								{String(internalTransferCount)}
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
				{#snippet children(entity)}
					{@const nftCount = entity.nftCount}
					{#if nftCount != null}
						<div>
							<dt>NFT count</dt>
							<dd>
								{String(nftCount)}
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
				{#snippet children(entity)}
					{@const firstTransactionAt = entity.firstTransactionAt}
					{#if firstTransactionAt != null}
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
				{#snippet children(entity)}
					{@const lastTransactionAt = entity.lastTransactionAt}
					{#if lastTransactionAt != null}
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
				{#snippet children(entity)}
					{@const isContract = entity.isContract}
					{#if isContract != null}
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
