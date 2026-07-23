<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { CoinId } from '$/constants/Coin.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { AssetInstanceKind } from '$/schema/AssetInstance.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AssetInstance>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AssetInstance>
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
	const assetInstance = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			symbol: true,
			name: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			symbol: true,
			name: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.symbol) ?? ''), String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || 'Asset instance')
	const viewDomId = $derived('asset-instance-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'kind' in selection.entitySelector
			&& selection.entitySelector.kind != null
			&& selection.entitySelector != null && 'assetKey' in selection.entitySelector
			&& selection.entitySelector.assetKey != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
				kind: String(selection.entitySelector.kind ?? ''),
				assetKey: String(selection.entitySelector.assetKey ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
					kind: String(selection.entitySelector.kind ?? ''),
					assetKey: String(selection.entitySelector.assetKey ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'symbol') && Object.hasOwn(prefetched, 'name')}
			{[String((pendingEntity.symbol) ?? ''), String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={assetInstance}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.symbol) ?? ''), String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'symbol') && Object.hasOwn(prefetched, 'name')}
			{[String((pendingEntity.symbol) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.symbol) ?? ''), String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={assetInstance}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.symbol) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.symbol) ?? ''), String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									kind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const kind = resolvedEntity.kind}
							{#if kind !== undefined && kind !== null}
								{String((kind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Asset key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									assetKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const assetKey = resolvedEntity.assetKey}
							{#if assetKey !== undefined && assetKey !== null}
								{String((assetKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							coinId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const coinId = resolvedEntity.coinId}
					{#if coinId !== undefined && coinId !== null}
						<div>
							<dt>Coin ID</dt>
							<dd>
								{String((coinId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									name: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const name = resolvedEntity.name}
							{#if name !== undefined && name !== null}
								{String((name) ?? '')}
							{/if}
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
						resource={
							selection({
								sources: selection.sources,
								fields: {
									symbol: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const symbol = resolvedEntity.symbol}
							{#if symbol !== undefined && symbol !== null}
								{String((symbol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							decimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decimals = resolvedEntity.decimals}
					{#if decimals !== undefined && decimals !== null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{String((decimals) ?? '')}
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
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$icon}
			>
				{#snippet children(media)}
					{#if media != null && media[EntityMetaKey.Selector] != null}
						<div>
							<dt>Icon</dt>
							<dd>
								<MediaView
									selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
									prefetched={media}
									href={
										(
											media[EntityMetaKey.Selector] != null && 'url' in media[EntityMetaKey.Selector]
											&& media[EntityMetaKey.Selector].url != null ?
												resolve('/media/[url=absoluteUrl]', {
											url: encodeURIComponent(String(media[EntityMetaKey.Selector].url ?? '')),
										})
										:
												undefined
										)
									}
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
					id='TokenMetadataDocumentsView-metadata'
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
					id='TokenProgramExtension_TimestampsView-token-program-extensions'
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
					id='RegulatedAssetProfilesView-regulated-profiles'
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
					id='TransferRestrictionsView-transfer-restrictions'
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
					id='NftCollectionsView-nft-collections'
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
					id='PayoutsView-payouts'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
