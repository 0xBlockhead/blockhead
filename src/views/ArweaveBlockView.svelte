<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.ArweaveBlock>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ArweaveBlock>>
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
	const arweaveBlock = $derived(selection({
		fields: {
			timestampMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.height) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.indepHash) ?? '')].filter(Boolean).join(' ') || 'arweave block')
	const viewDomId = $derived('arweave-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={arweaveBlock}>
			{#snippet Pending()}
				{@const height0 = pendingEntity.height}
				{#if height0 !== undefined && height0 !== null}
					<NumberValue value={Number(height0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const height0 = resolvedEntity.height}
				{#if height0 !== undefined && height0 !== null}
					<NumberValue value={Number(height0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={arweaveBlock}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
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
						selection={select(EntityType.ArweaveNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									height: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const height = pendingEntity.height}
							{#if height !== undefined && height !== null}
								<NumberValue value={Number(height)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const height = resolvedEntity.height}
							{#if height !== undefined && height !== null}
								<NumberValue value={Number(height)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>indep hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									indepHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indepHash = pendingEntity.indepHash}
							{#if indepHash !== undefined && indepHash !== null}
								<TruncatedValue value={String((indepHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indepHash = resolvedEntity.indepHash}
							{#if indepHash !== undefined && indepHash !== null}
								<TruncatedValue value={String((indepHash) ?? '')} />
							{/if}
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
				{#snippet Pending()}
					{@const previousBlock = pendingEntity.previousBlock}
					{#if previousBlock !== undefined && previousBlock !== null}
						<div>
							<dt>previous block</dt>
							<dd>
								<TruncatedValue value={String((previousBlock) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousBlock = resolvedEntity.previousBlock}
					{#if previousBlock !== undefined && previousBlock !== null}
						<div>
							<dt>previous block</dt>
							<dd>
								<TruncatedValue value={String((previousBlock) ?? '')} />
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = pendingEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
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
				{#snippet Pending()}
					{@const transactionCount = pendingEntity.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>transaction count</dt>
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
							<dt>transaction count</dt>
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
							blockSizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockSizeBytes = pendingEntity.blockSizeBytes}
					{#if blockSizeBytes !== undefined && blockSizeBytes !== null}
						<div>
							<dt>block size bytes</dt>
							<dd>
								<NumberValue value={Number(blockSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockSizeBytes = resolvedEntity.blockSizeBytes}
					{#if blockSizeBytes !== undefined && blockSizeBytes !== null}
						<div>
							<dt>block size bytes</dt>
							<dd>
								<NumberValue value={Number(blockSizeBytes)} />
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
				{#snippet Pending()}
					{@const weaveSizeBytes = pendingEntity.weaveSizeBytes}
					{#if weaveSizeBytes !== undefined && weaveSizeBytes !== null}
						<div>
							<dt>weave size bytes</dt>
							<dd>
								<NumberValue value={Number(weaveSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const weaveSizeBytes = resolvedEntity.weaveSizeBytes}
					{#if weaveSizeBytes !== undefined && weaveSizeBytes !== null}
						<div>
							<dt>weave size bytes</dt>
							<dd>
								<NumberValue value={Number(weaveSizeBytes)} />
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
				{#snippet Pending()}
					{@const transactionRoot = pendingEntity.transactionRoot}
					{#if transactionRoot !== undefined && transactionRoot !== null}
						<div>
							<dt>transaction root</dt>
							<dd>
								{String((transactionRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionRoot = resolvedEntity.transactionRoot}
					{#if transactionRoot !== undefined && transactionRoot !== null}
						<div>
							<dt>transaction root</dt>
							<dd>
								{String((transactionRoot) ?? '')}
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
				{#snippet Pending()}
					{@const walletList = pendingEntity.walletList}
					{#if walletList !== undefined && walletList !== null}
						<div>
							<dt>wallet list</dt>
							<dd>
								{String((walletList) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const walletList = resolvedEntity.walletList}
					{#if walletList !== undefined && walletList !== null}
						<div>
							<dt>wallet list</dt>
							<dd>
								{String((walletList) ?? '')}
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
				{#snippet Pending()}
					{@const rewardAddress = pendingEntity.rewardAddress}
					{#if rewardAddress !== undefined && rewardAddress !== null}
						<div>
							<dt>reward address</dt>
							<dd>
								<TruncatedValue value={String((rewardAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardAddress = resolvedEntity.rewardAddress}
					{#if rewardAddress !== undefined && rewardAddress !== null}
						<div>
							<dt>reward address</dt>
							<dd>
								<TruncatedValue value={String((rewardAddress) ?? '')} />
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
				{#snippet Pending()}
					{@const rewardPoolWinston = pendingEntity.rewardPoolWinston}
					{#if rewardPoolWinston !== undefined && rewardPoolWinston !== null}
						<div>
							<dt>reward pool winston</dt>
							<dd>
								<NumberValue value={Number(rewardPoolWinston)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardPoolWinston = resolvedEntity.rewardPoolWinston}
					{#if rewardPoolWinston !== undefined && rewardPoolWinston !== null}
						<div>
							<dt>reward pool winston</dt>
							<dd>
								<NumberValue value={Number(rewardPoolWinston)} />
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
				{#snippet Pending()}
					{@const cumulativeDiff = pendingEntity.cumulativeDiff}
					{#if cumulativeDiff !== undefined && cumulativeDiff !== null}
						<div>
							<dt>cumulative diff</dt>
							<dd>
								<NumberValue value={Number(cumulativeDiff)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cumulativeDiff = resolvedEntity.cumulativeDiff}
					{#if cumulativeDiff !== undefined && cumulativeDiff !== null}
						<div>
							<dt>cumulative diff</dt>
							<dd>
								<NumberValue value={Number(cumulativeDiff)} />
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
				{#snippet Pending()}
					{@const hashListMerkle = pendingEntity.hashListMerkle}
					{#if hashListMerkle !== undefined && hashListMerkle !== null}
						<div>
							<dt>hash list merkle</dt>
							<dd>
								<TruncatedValue value={String((hashListMerkle) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hashListMerkle = resolvedEntity.hashListMerkle}
					{#if hashListMerkle !== undefined && hashListMerkle !== null}
						<div>
							<dt>hash list merkle</dt>
							<dd>
								<TruncatedValue value={String((hashListMerkle) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ArweaveTransactionsView
				selection={
						selection.$$transactions({
							count: true,
						})
					}
				title='transactions'
				emptyText='No transactions found.'
				id='ArweaveTransactionsView-transactions'
			/>
		{/if}
	{/snippet}
</EntityView>
