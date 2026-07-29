<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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

	const network = $derived(selection.entitySelector.$network)
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
	const titleFallback = $derived([(prefetched.symbol ?? ''), (prefetched.name ?? '')].filter(Boolean).join(' ') || 'Asset instance')


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
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					kind: selection.entitySelector.kind,
					assetKey: selection.entitySelector.assetKey,
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
					{selection.entitySelector.kind}
				</dd>
			</div>

			<div>
				<dt>Asset key</dt>
				<dd>
					{selection.entitySelector.assetKey}
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
								{decimals}
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
		{@const metadataResource = selection.$$metadata}
		<ResourceBoundary
			resource={metadataResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<TokenMetadataDocumentsView
						selection={metadataResource}
						countResource={metadataResource.count}
						title='Metadata'
						id='metadata'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const tokenProgramExtensionsResource = selection.$$tokenProgramExtensions}
		<ResourceBoundary
			resource={tokenProgramExtensionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<TokenProgramExtension_TimestampsView
						selection={tokenProgramExtensionsResource}
						countResource={tokenProgramExtensionsResource.count}
						title='Token program extensions'
						id='token-program-extensions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const regulatedProfilesResource = selection.$$regulatedProfiles}
		<ResourceBoundary
			resource={regulatedProfilesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RegulatedAssetProfilesView
						selection={regulatedProfilesResource}
						countResource={regulatedProfilesResource.count}
						title='Regulated profiles'
						id='regulated-profiles'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const transferRestrictionsResource = selection.$$transferRestrictions}
		<ResourceBoundary
			resource={transferRestrictionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<TransferRestrictionsView
						selection={transferRestrictionsResource}
						countResource={transferRestrictionsResource.count}
						title='Transfer restrictions'
						id='transfer-restrictions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const nftCollectionsResource = selection.$$nftCollections}
		<ResourceBoundary
			resource={nftCollectionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NftCollectionsView
						selection={nftCollectionsResource}
						countResource={nftCollectionsResource.count}
						title='NFT collections'
						id='nft-collections'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const payoutsResource = selection.$$payouts}
		<ResourceBoundary
			resource={payoutsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<PayoutsView
						selection={payoutsResource}
						countResource={payoutsResource.count}
						title='Payouts'
						id='payouts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
