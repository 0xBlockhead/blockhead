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
	}: EntitySelectionViewProps<EntityType.NftToken> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UsageRight_TimestampsView from '$/views/UsageRight_TimestampsView.svelte'
	import NftCollectionView from '$/views/NftCollectionView.svelte'
	import AssetObjectView from '$/views/AssetObjectView.svelte'
	import TokenMetadataDocumentView from '$/views/TokenMetadataDocumentView.svelte'
</script>


<EntityView
	entityType={EntityType.NftToken}
	entitySelector={selection.entitySelector}
	title={title ?? 'NFT token'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		NFT token
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
					{selection.entitySelector.tokenKey}
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
				{#snippet children(entity)}
					{@const tokenId = entity.tokenId}
					{#if tokenId != null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{tokenId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$assetObject}
			>
				{#snippet children(assetObject)}
					{#if assetObject != null}
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
				resource={selection.$metadata}
			>
				{#snippet children(tokenMetadataDocument)}
					{#if tokenMetadataDocument != null}
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
		{@const usageRightTimestampsResource = selection.$$usageRightTimestamps}
		<ResourceBoundary
			resource={usageRightTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<UsageRight_TimestampsView
						selection={usageRightTimestampsResource}
						countResource={usageRightTimestampsResource.count}
						title='usage right timestamps'
						id='usage-right-timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
