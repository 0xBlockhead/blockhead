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
	}: EntitySelectionViewProps<EntityType.ArweaveBlock> = $props()

	const arweaveBlock = $derived(selection({
		fields: {
			height: true,
			timestampMs: true,
			indepHash: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ArweaveTransactionsView from '$/views/ArweaveTransactionsView.svelte'
	import ArweaveNetworkView from '$/views/ArweaveNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ArweaveBlock}
	entitySelector={selection.entitySelector}
	title={title ?? (String(prefetched.height ?? '') || (prefetched.indepHash ?? '') || 'arweave block')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={arweaveBlock}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.height}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={arweaveBlock}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<Timestamp timestamp={timestampMs} />
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
					/>
				</dd>
			</div>

			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary
						resource={arweaveBlock}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.height}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>indep hash</dt>
				<dd>
					<ResourceBoundary
						resource={arweaveBlock}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.indepHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousBlock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousBlock = entity.previousBlock}
					{#if previousBlock != null}
						<div>
							<dt>previous block</dt>
							<dd>
								<TruncatedValue value={previousBlock} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={arweaveBlock}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>transaction count</dt>
							<dd>
								<NumberValue
									value={transactionCount}
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
							blockSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockSizeBytes = entity.blockSizeBytes}
					{#if blockSizeBytes != null}
						<div>
							<dt>block size bytes</dt>
							<dd>
								<NumberValue
									value={blockSizeBytes}
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
							weaveSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const weaveSizeBytes = entity.weaveSizeBytes}
					{#if weaveSizeBytes != null}
						<div>
							<dt>weave size bytes</dt>
							<dd>
								<NumberValue
									value={weaveSizeBytes}
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
							transactionRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionRoot = entity.transactionRoot}
					{#if transactionRoot != null}
						<div>
							<dt>transaction root</dt>
							<dd>
								{transactionRoot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							walletList: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const walletList = entity.walletList}
					{#if walletList != null}
						<div>
							<dt>wallet list</dt>
							<dd>
								{walletList}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rewardAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rewardAddress = entity.rewardAddress}
					{#if rewardAddress != null}
						<div>
							<dt>reward address</dt>
							<dd>
								<TruncatedValue value={rewardAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rewardPoolWinston: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rewardPoolWinston = entity.rewardPoolWinston}
					{#if rewardPoolWinston != null}
						<div>
							<dt>reward pool winston</dt>
							<dd>
								<NumberValue
									value={rewardPoolWinston}
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
							cumulativeDiff: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cumulativeDiff = entity.cumulativeDiff}
					{#if cumulativeDiff != null}
						<div>
							<dt>cumulative diff</dt>
							<dd>
								<NumberValue
									value={cumulativeDiff}
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
							hashListMerkle: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hashListMerkle = entity.hashListMerkle}
					{#if hashListMerkle != null}
						<div>
							<dt>hash list merkle</dt>
							<dd>
								{hashListMerkle}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const transactionsResource = selection.$$transactions}
		<ResourceBoundary
			resource={transactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ArweaveTransactionsView
						selection={transactionsResource}
						countResource={transactionsResource.count}
						title='transactions'
						id='transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
