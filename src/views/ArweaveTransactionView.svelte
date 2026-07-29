<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.ArweaveTransaction> = $props()

	const arweaveTransaction = $derived(selection({
		fields: {
			quantityWinston: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ArweaveNetworkView from '$/views/ArweaveNetworkView.svelte'
	import ArweaveBlockView from '$/views/ArweaveBlockView.svelte'
	import ArweaveResourceView from '$/views/ArweaveResourceView.svelte'
</script>


<EntityView
	entityType={EntityType.ArweaveTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.transactionId || 'arweave transaction')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.transactionId} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={arweaveTransaction}>
			{#snippet children(entity)}
				{@const quantityWinston = entity.quantityWinston}
				{#if quantityWinston != null}
					<NumberValue
						value={quantityWinston}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$block}
		>
			{#snippet children(arweaveBlock)}
				{#if arweaveBlock != null}
					<span data-text="muted">
						<ArweaveBlockView
							selection={select(EntityType.ArweaveBlock, arweaveBlock[EntityMetaKey.Selector])}
							prefetched={arweaveBlock}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ResourceBoundary
			resource={selection.$resource}
		>
			{#snippet children(arweaveResource)}
				{#if arweaveResource != null}
					<span data-text="muted">
						<ArweaveResourceView
							selection={select(EntityType.ArweaveResource, arweaveResource[EntityMetaKey.Selector])}
							prefetched={arweaveResource}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<ArweaveNetworkView
						selection={select(EntityType.ArweaveNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.transactionId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(arweaveBlock)}
					{#if arweaveBlock != null}
						<div>
							<dt>block</dt>
							<dd>
								<ArweaveBlockView
									selection={select(EntityType.ArweaveBlock, arweaveBlock[EntityMetaKey.Selector])}
									prefetched={arweaveBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$resource}
			>
				{#snippet children(arweaveResource)}
					{#if arweaveResource != null}
						<div>
							<dt>resource</dt>
							<dd>
								<ArweaveResourceView
									selection={select(EntityType.ArweaveResource, arweaveResource[EntityMetaKey.Selector])}
									prefetched={arweaveResource}
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
							ownerAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ownerAddress = entity.ownerAddress}
					{#if ownerAddress != null}
						<div>
							<dt>owner address</dt>
							<dd>
								<TruncatedValue value={ownerAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							targetAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const targetAddress = entity.targetAddress}
					{#if targetAddress != null}
						<div>
							<dt>target address</dt>
							<dd>
								<TruncatedValue value={targetAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={arweaveTransaction}
			>
				{#snippet children(entity)}
					{@const quantityWinston = entity.quantityWinston}
					{#if quantityWinston != null}
						<div>
							<dt>quantity winston</dt>
							<dd>
								<NumberValue
									value={quantityWinston}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rewardWinston: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rewardWinston = entity.rewardWinston}
					{#if rewardWinston != null}
						<div>
							<dt>reward winston</dt>
							<dd>
								<NumberValue
									value={rewardWinston}
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
							signature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signature = entity.signature}
					{#if signature != null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={signature} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastTx: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastTx = entity.lastTx}
					{#if lastTx != null}
						<div>
							<dt>last transaction</dt>
							<dd>
								{lastTx}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dataRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dataRoot = entity.dataRoot}
					{#if dataRoot != null}
						<div>
							<dt>data root</dt>
							<dd>
								{dataRoot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dataSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dataSizeBytes = entity.dataSizeBytes}
					{#if dataSizeBytes != null}
						<div>
							<dt>data size bytes</dt>
							<dd>
								<NumberValue
									value={dataSizeBytes}
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
							format: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const format = entity.format}
					{#if format != null}
						<div>
							<dt>format</dt>
							<dd>
								<NumberValue
									value={format}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							denomination: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const denomination = entity.denomination}
					{#if denomination != null}
						<div>
							<dt>denomination</dt>
							<dd>
								<NumberValue
									value={denomination}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
