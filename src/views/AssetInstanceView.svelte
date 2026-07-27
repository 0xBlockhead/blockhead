<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { CoinId } from '$/constants/Coin.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { AssetInstanceKind } from '$/schema/AssetInstance.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.AssetInstance> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const assetInstance = $derived(viewSelection({
		fields: {
			symbol: true,
			name: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.symbol ?? ''), (pendingEntity.name ?? '')].filter(Boolean).join(' ') || 'Asset instance')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TokenMetadataDocumentsView from '$/views/TokenMetadataDocumentsView.svelte'
	import TokenProgramExtension_TimestampsView from '$/views/TokenProgramExtension_TimestampsView.svelte'
	import RegulatedAssetProfilesView from '$/views/RegulatedAssetProfilesView.svelte'
	import TransferRestrictionsView from '$/views/TransferRestrictionsView.svelte'
	import NftCollectionsView from '$/views/NftCollectionsView.svelte'
	import PayoutsView from '$/views/PayoutsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetInstance}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$network ?
						String(caip2StringFromValue(selection.entitySelector.$network.caip2))
					:
						String(selection.entitySelector.$network.slug)
				),
				kind: String(selection.entitySelector.kind),
				assetKey: String(selection.entitySelector.assetKey),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={assetInstance}>
			{#snippet children(entity)}
				{[entity.symbol, entity.name].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={assetInstance}>
			{#snippet children(entity)}
				{entity.symbol || [entity.symbol, entity.name].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A concrete asset on a specific network or venue, such as a native coin, token, share, or collectible.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>
					{pendingEntity.kind}
				</dd>
			</div>

			<div>
				<dt>Asset key</dt>
				<dd>
					{pendingEntity.assetKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							coinId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const coinId = entity.coinId}
					{#if coinId != null}
						<div>
							<dt>Coin ID</dt>
							<dd>
								{coinId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={assetInstance}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Symbol</dt>
				<dd>
					<ResourceBoundary
						resource={assetInstance}
					>
						{#snippet children(entity)}
							{entity.symbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							decimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const decimals = entity.decimals}
					{#if decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{String(decimals)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$icon}
			>
				{#snippet children(media)}
					{#if media != null}
						<div>
							<dt>Icon</dt>
							<dd>
								<MediaView
									selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
									prefetched={media}
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
		{@const assetInstanceTokenMetadataDocumentsViewMetadataResource = selection.$$metadata}
		<ResourceBoundary
			resource={assetInstanceTokenMetadataDocumentsViewMetadataResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<TokenMetadataDocumentsView
						selection={assetInstanceTokenMetadataDocumentsViewMetadataResource}
						countResource={assetInstanceTokenMetadataDocumentsViewMetadataResource.count}
						title='Metadata'
						id='metadata'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const assetInstanceTokenProgramExtensionTimestampsViewTokenProgramExtensionsResource = selection.$$tokenProgramExtensions}
		<ResourceBoundary
			resource={assetInstanceTokenProgramExtensionTimestampsViewTokenProgramExtensionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<TokenProgramExtension_TimestampsView
						selection={assetInstanceTokenProgramExtensionTimestampsViewTokenProgramExtensionsResource}
						countResource={assetInstanceTokenProgramExtensionTimestampsViewTokenProgramExtensionsResource.count}
						title='Token program extensions'
						id='token-program-extensions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const assetInstanceRegulatedAssetProfilesViewRegulatedProfilesResource = selection.$$regulatedProfiles}
		<ResourceBoundary
			resource={assetInstanceRegulatedAssetProfilesViewRegulatedProfilesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RegulatedAssetProfilesView
						selection={assetInstanceRegulatedAssetProfilesViewRegulatedProfilesResource}
						countResource={assetInstanceRegulatedAssetProfilesViewRegulatedProfilesResource.count}
						title='Regulated profiles'
						id='regulated-profiles'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const assetInstanceTransferRestrictionsViewTransferRestrictionsResource = selection.$$transferRestrictions}
		<ResourceBoundary
			resource={assetInstanceTransferRestrictionsViewTransferRestrictionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<TransferRestrictionsView
						selection={assetInstanceTransferRestrictionsViewTransferRestrictionsResource}
						countResource={assetInstanceTransferRestrictionsViewTransferRestrictionsResource.count}
						title='Transfer restrictions'
						id='transfer-restrictions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const assetInstanceNftCollectionsViewNftCollectionsResource = selection.$$nftCollections}
		<ResourceBoundary
			resource={assetInstanceNftCollectionsViewNftCollectionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NftCollectionsView
						selection={assetInstanceNftCollectionsViewNftCollectionsResource}
						countResource={assetInstanceNftCollectionsViewNftCollectionsResource.count}
						title='NFT collections'
						id='nft-collections'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const assetInstancePayoutsViewPayoutsResource = selection.$$payouts}
		<ResourceBoundary
			resource={assetInstancePayoutsViewPayoutsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<PayoutsView
						selection={assetInstancePayoutsViewPayoutsResource}
						countResource={assetInstancePayoutsViewPayoutsResource.count}
						title='Payouts'
						id='payouts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
