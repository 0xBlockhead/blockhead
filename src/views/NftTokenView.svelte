<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.NftToken>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NftToken>>
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
	const nftToken = $derived(selection({}))
	const titleFallback = $derived('NFT token')
	const viewDomId = $derived('nft-token-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UsageRight_TimestampsView from '$/views/UsageRight_TimestampsView.svelte'
	import NftCollectionView from '$/views/NftCollectionView.svelte'
	import AssetObjectView from '$/views/AssetObjectView.svelte'
	import TokenMetadataDocumentView from '$/views/TokenMetadataDocumentView.svelte'
</script>


<EntityView
	entityType={EntityType.NftToken}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nftToken}>
			{#snippet Pending()}
				{title || 'NFT token'}
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
					<NftCollectionView
						selection={select(EntityType.NftCollection, selection.entitySelector.$collection)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>token key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									tokenKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const tokenKey = selection.entitySelector.tokenKey ?? prefetched.tokenKey}
							{#if tokenKey !== undefined && tokenKey !== null}
								{String((tokenKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tokenKey = resolvedEntity.tokenKey}
							{#if tokenKey !== undefined && tokenKey !== null}
								{String((tokenKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenId = prefetched.tokenId}
					{#if tokenId !== undefined && tokenId !== null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{String((tokenId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenId = resolvedEntity.tokenId}
					{#if tokenId !== undefined && tokenId !== null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{String((tokenId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.AssetObject, false>('$assetObject')}
			>
				{#snippet children(assetObject)}
					{#if assetObject != null && assetObject[EntityMetaKey.Selector] != null}
						<div>
							<dt>asset object</dt>
							<dd>
								<AssetObjectView
									selection={select(EntityType.AssetObject, assetObject[EntityMetaKey.Selector])}
									prefetched={assetObject}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.TokenMetadataDocument, false>('$metadata')}
			>
				{#snippet children(tokenMetadataDocument)}
					{#if tokenMetadataDocument != null && tokenMetadataDocument[EntityMetaKey.Selector] != null}
						<div>
							<dt>metadata</dt>
							<dd>
								<TokenMetadataDocumentView
									selection={select(EntityType.TokenMetadataDocument, tokenMetadataDocument[EntityMetaKey.Selector])}
									prefetched={tokenMetadataDocument}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<UsageRight_TimestampsView
				selection={selection[EntityProxyField]<EntityType.UsageRight_Timestamp>('$$usageRightTimestamps')}
				title='usage right timestamps'
				emptyText='No usage right observations.'
				id='UsageRight_TimestampsView-$$usageRightTimestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
