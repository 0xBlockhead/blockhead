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
			selection: RegisteredEntityProxyResource<EntityType.ArweaveTransaction>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ArweaveTransaction>>
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
	const arweaveTransaction = $derived(selection({
		sources: selection.sources,
		fields: {
			quantityWinston: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.transactionId) ?? '')].filter(Boolean).join(' ') || 'arweave transaction')
	const viewDomId = $derived('arweave-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const transactionId0 = pendingEntity.transactionId}
					{#if transactionId0 !== undefined && transactionId0 !== null}
						<TruncatedValue value={String((transactionId0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={arweaveTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionId0 = resolvedEntity.transactionId}
					{#if transactionId0 !== undefined && transactionId0 !== null}
						<TruncatedValue value={String((transactionId0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const quantityWinston0 = pendingEntity.quantityWinston}
					{#if quantityWinston0 !== undefined && quantityWinston0 !== null}
						<NumberValue
							value={quantityWinston0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={arweaveTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quantityWinston0 = resolvedEntity.quantityWinston}
					{#if quantityWinston0 !== undefined && quantityWinston0 !== null}
						<NumberValue
							value={quantityWinston0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(arweaveBlock)}
					{#if arweaveBlock != null && arweaveBlock[EntityMetaKey.Selector] != null}
						<span data-text="muted">
							<ArweaveBlockView
								selection={select(EntityType.ArweaveBlock, arweaveBlock[EntityMetaKey.Selector])}
								prefetched={arweaveBlock}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{:else}
						<span data-text="muted">Unavailable</span>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$resource}
			>
				{#snippet children(arweaveResource)}
					{#if arweaveResource != null && arweaveResource[EntityMetaKey.Selector] != null}
						<span data-text="muted">
							<ArweaveResourceView
								selection={select(EntityType.ArweaveResource, arweaveResource[EntityMetaKey.Selector])}
								prefetched={arweaveResource}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{:else}
						<span data-text="muted">Unavailable</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={arweaveTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$block}
					>
						{#snippet children(arweaveBlock)}
							{#if arweaveBlock != null && arweaveBlock[EntityMetaKey.Selector] != null}
								<span data-text="muted">
									<ArweaveBlockView
										selection={select(EntityType.ArweaveBlock, arweaveBlock[EntityMetaKey.Selector])}
										prefetched={arweaveBlock}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={selection.$resource}
					>
						{#snippet children(arweaveResource)}
							{#if arweaveResource != null && arweaveResource[EntityMetaKey.Selector] != null}
								<span data-text="muted">
									<ArweaveResourceView
										selection={select(EntityType.ArweaveResource, arweaveResource[EntityMetaKey.Selector])}
										prefetched={arweaveResource}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
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
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									transactionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionId = resolvedEntity.transactionId}
							{#if transactionId !== undefined && transactionId !== null}
								<TruncatedValue value={String((transactionId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(arweaveBlock)}
					{#if arweaveBlock != null && arweaveBlock[EntityMetaKey.Selector] != null}
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
					{#if arweaveResource != null && arweaveResource[EntityMetaKey.Selector] != null}
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
						sources: selection.sources,
						fields: {
							ownerAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ownerAddress = resolvedEntity.ownerAddress}
					{#if ownerAddress !== undefined && ownerAddress !== null}
						<div>
							<dt>owner address</dt>
							<dd>
								<TruncatedValue value={String((ownerAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							targetAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const targetAddress = resolvedEntity.targetAddress}
					{#if targetAddress !== undefined && targetAddress !== null}
						<div>
							<dt>target address</dt>
							<dd>
								<TruncatedValue value={String((targetAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							quantityWinston: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quantityWinston = resolvedEntity.quantityWinston}
					{#if quantityWinston !== undefined && quantityWinston !== null}
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
						sources: selection.sources,
						fields: {
							rewardWinston: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardWinston = resolvedEntity.rewardWinston}
					{#if rewardWinston !== undefined && rewardWinston !== null}
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
						sources: selection.sources,
						fields: {
							signature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signature = resolvedEntity.signature}
					{#if signature !== undefined && signature !== null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={String((signature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							lastTx: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastTx = resolvedEntity.lastTx}
					{#if lastTx !== undefined && lastTx !== null}
						<div>
							<dt>last transaction</dt>
							<dd>
								{String((lastTx) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							dataRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataRoot = resolvedEntity.dataRoot}
					{#if dataRoot !== undefined && dataRoot !== null}
						<div>
							<dt>data root</dt>
							<dd>
								{String((dataRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							dataSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataSizeBytes = resolvedEntity.dataSizeBytes}
					{#if dataSizeBytes !== undefined && dataSizeBytes !== null}
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
						sources: selection.sources,
						fields: {
							format: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const format = resolvedEntity.format}
					{#if format !== undefined && format !== null}
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
						sources: selection.sources,
						fields: {
							denomination: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const denomination = resolvedEntity.denomination}
					{#if denomination !== undefined && denomination !== null}
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
