<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EvmNetworkAccount_Timestamp>, 'prefetched'> = $props()

	const evmNetworkAccountTimestamp = $derived(selection({
		fields: {
			transactionCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'EVM network account timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EvmNetworkAccountView
			selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkAccountTimestamp}>
			{#snippet children(entity)}
				{@const transactionCount = entity.transactionCount}
				{#if transactionCount != null}
					<NumberValue
						value={transactionCount}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
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
								{blockNumber}
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
								{transactionCount}
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
								{tokenTransferCount}
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
								{internalTransferCount}
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
								{nftCount}
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
								<Timestamp timestamp={firstTransactionAt} />
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
								<Timestamp timestamp={lastTransactionAt} />
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
