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
			selection: EntityProxyResource<typeof schema, EntityType.TonNftCollection_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonNftCollection_Timestamp>>
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
	const tonNftCollectionTimestamp = $derived(selection({}))
	const titleFallback = $derived('TON NFT collection timestamp')
	const viewDomId = $derived('ton-nft-collection-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonNftCollectionView from '$/views/TonNftCollectionView.svelte'
</script>


<EntityView
	entityType={EntityType.TonNftCollection_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonNftCollectionTimestamp}>
			{#snippet Pending()}
				{title || 'TON NFT collection timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>collection</dt>
				<dd>
					<TonNftCollectionView
						selection={select(EntityType.TonNftCollection, selection.entitySelector.$collection, {})}
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
							ownerAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ownerAddress = pendingEntity.ownerAddress}
					{#if ownerAddress !== undefined && ownerAddress !== null}
						<div>
							<dt>owner address</dt>
							<dd>
								<TruncatedValue value={String((ownerAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							nextItemIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nextItemIndex = pendingEntity.nextItemIndex}
					{#if nextItemIndex !== undefined && nextItemIndex !== null}
						<div>
							<dt>next item index</dt>
							<dd>
								{String((nextItemIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nextItemIndex = resolvedEntity.nextItemIndex}
					{#if nextItemIndex !== undefined && nextItemIndex !== null}
						<div>
							<dt>next item index</dt>
							<dd>
								{String((nextItemIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = pendingEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const description = pendingEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const description = resolvedEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							imageUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const imageUrl = pendingEntity.imageUrl}
					{#if imageUrl !== undefined && imageUrl !== null}
						<div>
							<dt>image URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(imageUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(imageUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const imageUrl = resolvedEntity.imageUrl}
					{#if imageUrl !== undefined && imageUrl !== null}
						<div>
							<dt>image URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(imageUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(imageUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metadataUri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const metadataUri = pendingEntity.metadataUri}
					{#if metadataUri !== undefined && metadataUri !== null}
						<div>
							<dt>metadata URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(metadataUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(metadataUri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadataUri = resolvedEntity.metadataUri}
					{#if metadataUri !== undefined && metadataUri !== null}
						<div>
							<dt>metadata URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(metadataUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(metadataUri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							itemCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const itemCount = pendingEntity.itemCount}
					{#if itemCount !== undefined && itemCount !== null}
						<div>
							<dt>item count</dt>
							<dd>
								{String((itemCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const itemCount = resolvedEntity.itemCount}
					{#if itemCount !== undefined && itemCount !== null}
						<div>
							<dt>item count</dt>
							<dd>
								{String((itemCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							codeHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const codeHash = pendingEntity.codeHash}
					{#if codeHash !== undefined && codeHash !== null}
						<div>
							<dt>code hash</dt>
							<dd>
								<TruncatedValue value={String((codeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const codeHash = resolvedEntity.codeHash}
					{#if codeHash !== undefined && codeHash !== null}
						<div>
							<dt>code hash</dt>
							<dd>
								<TruncatedValue value={String((codeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dataHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const dataHash = pendingEntity.dataHash}
					{#if dataHash !== undefined && dataHash !== null}
						<div>
							<dt>data hash</dt>
							<dd>
								<TruncatedValue value={String((dataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataHash = resolvedEntity.dataHash}
					{#if dataHash !== undefined && dataHash !== null}
						<div>
							<dt>data hash</dt>
							<dd>
								<TruncatedValue value={String((dataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verification: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verification = pendingEntity.verification}
					{#if verification !== undefined && verification !== null}
						<div>
							<dt>verification</dt>
							<dd>
								{String((verification) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verification = resolvedEntity.verification}
					{#if verification !== undefined && verification !== null}
						<div>
							<dt>verification</dt>
							<dd>
								{String((verification) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastTransactionLt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastTransactionLt = pendingEntity.lastTransactionLt}
					{#if lastTransactionLt !== undefined && lastTransactionLt !== null}
						<div>
							<dt>last transaction lt</dt>
							<dd>
								{String((lastTransactionLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastTransactionLt = resolvedEntity.lastTransactionLt}
					{#if lastTransactionLt !== undefined && lastTransactionLt !== null}
						<div>
							<dt>last transaction lt</dt>
							<dd>
								{String((lastTransactionLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
