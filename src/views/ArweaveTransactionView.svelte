<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ArweaveTransaction>, 'prefetched'> = $props()

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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					transactionId: selection.entitySelector.transactionId,
				}
			)
		:
			href ?? undefined
	}
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
					{@const arweaveBlockInitial = untrack(() => arweaveBlock)}
					<span data-text="muted">
						<ArweaveBlockView
							selection={select(EntityType.ArweaveBlock, (arweaveBlock ?? arweaveBlockInitial)[EntityMetaKey.Selector])}
							prefetched={arweaveBlock ?? arweaveBlockInitial}
							layout={EntityLayout.Title}
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
					{@const arweaveResourceInitial = untrack(() => arweaveResource)}
					<span data-text="muted">
						<ArweaveResourceView
							selection={select(EntityType.ArweaveResource, (arweaveResource ?? arweaveResourceInitial)[EntityMetaKey.Selector])}
							prefetched={arweaveResource ?? arweaveResourceInitial}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<ArweaveNetworkView
						selection={select(EntityType.ArweaveNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
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
						{@const arweaveBlockInitial = untrack(() => arweaveBlock)}
						<div>
							<dt>block</dt>
							<dd>
								<ArweaveBlockView
									selection={select(EntityType.ArweaveBlock, (arweaveBlock ?? arweaveBlockInitial)[EntityMetaKey.Selector])}
									prefetched={arweaveBlock ?? arweaveBlockInitial}
									layout={EntityLayout.Value}
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
						{@const arweaveResourceInitial = untrack(() => arweaveResource)}
						<div>
							<dt>resource</dt>
							<dd>
								<ArweaveResourceView
									selection={select(EntityType.ArweaveResource, (arweaveResource ?? arweaveResourceInitial)[EntityMetaKey.Selector])}
									prefetched={arweaveResource ?? arweaveResourceInitial}
									layout={EntityLayout.Value}
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
