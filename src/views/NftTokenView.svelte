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
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.NftToken>, 'prefetched'> = $props()


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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/collection/(nftCollection)/token/[tokenKey=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$collection.$assetInstance.$network ?
							caip2StringFromValue(selection.entitySelector.$collection.$assetInstance.$network.caip2)
						:
							selection.entitySelector.$collection.$assetInstance.$network.slug
					),
					kind: selection.entitySelector.$collection.$assetInstance.kind,
					assetKey: selection.entitySelector.$collection.$assetInstance.assetKey,
					tokenKey: selection.entitySelector.tokenKey,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>collection</dt>
				<dd>
					<NftCollectionView
						selection={select(EntityType.NftCollection, selection.entitySelector.$collection)}
						layout={EntityLayout.Value}
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
									layout={EntityLayout.Value}
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
						{@const tokenMetadataDocumentInitial = untrack(() => tokenMetadataDocument)}
						<div>
							<dt>metadata</dt>
							<dd>
								<TokenMetadataDocumentView
									selection={select(EntityType.TokenMetadataDocument, (tokenMetadataDocument ?? tokenMetadataDocumentInitial)[EntityMetaKey.Selector])}
									prefetched={tokenMetadataDocument ?? tokenMetadataDocumentInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
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
