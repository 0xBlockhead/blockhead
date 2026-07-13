<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AssetInstance>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AssetInstance>>
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
	const assetInstance = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			symbol: true,
			name: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.symbol) ?? ''), String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || 'Asset instance')
	const viewDomId = $derived('asset-instance-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.kind !== undefined && pendingEntity.assetKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
			network: String(pendingEntity.$network.slug ?? ''),
			kind: String(pendingEntity.kind ?? ''),
			assetKey: String(pendingEntity.assetKey ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={assetInstance}>
			{#snippet Pending()}
				{[String((pendingEntity.symbol) ?? ''), String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || 'Asset instance'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.symbol) ?? ''), String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={assetInstance}>
			{#snippet Pending()}
				{[String((pendingEntity.symbol) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.symbol) ?? ''), String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || 'Asset instance'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.symbol) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.symbol) ?? ''), String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									kind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const kind = pendingEntity.kind}
							{#if kind !== undefined && kind !== null}
								{String((kind) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									assetKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const assetKey = pendingEntity.assetKey}
							{#if assetKey !== undefined && assetKey !== null}
								{String((assetKey) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							coinId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const coinId = pendingEntity.coinId}
					{#if coinId !== undefined && coinId !== null}
						<div>
							<dt>Coin ID</dt>
							<dd>
								{String((coinId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
								fields: {
									name: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const name = pendingEntity.name}
							{#if name !== undefined && name !== null}
								{String((name) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									symbol: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const symbol = pendingEntity.symbol}
							{#if symbol !== undefined && symbol !== null}
								{String((symbol) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							decimals: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const decimals = pendingEntity.decimals}
					{#if decimals !== undefined && decimals !== null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{String((decimals) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$icon}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(media)}
					{#if media != null && media[EntityMetaKey.Selector] != null}
						<div>
							<dt>Icon</dt>
							<dd>
								<MediaView
									selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
									prefetched={media}
									href={
										(media[EntityMetaKey.Selector].url !== undefined ? resolve('/media/[url=absoluteUrl]', {
											url: String(media[EntityMetaKey.Selector].url ?? ''),
										}) : undefined)
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
		{#if detailsOpen}
			<TokenMetadataDocumentsView
				selection={selection.$$metadata}
				title='Metadata'
				emptyText='No token metadata documents.'
				id='TokenMetadataDocumentsView-metadata'
			/>

			<TokenProgramExtension_TimestampsView
				selection={selection.$$tokenProgramExtensions}
				title='Token program extensions'
				emptyText='No token program extension observations.'
				id='TokenProgramExtension_TimestampsView-token-program-extensions'
			/>

			<RegulatedAssetProfilesView
				selection={selection.$$regulatedProfiles}
				title='Regulated profiles'
				emptyText='No regulated asset profiles.'
				id='RegulatedAssetProfilesView-regulated-profiles'
			/>

			<TransferRestrictionsView
				selection={selection.$$transferRestrictions}
				title='Transfer restrictions'
				emptyText='No transfer restrictions.'
				id='TransferRestrictionsView-transfer-restrictions'
			/>

			<NftCollectionsView
				selection={selection.$$nftCollections}
				title='NFT collections'
				emptyText='No NFT collections.'
				id='NftCollectionsView-nft-collections'
			/>

			<PayoutsView
				selection={selection.$$payouts}
				title='Payouts'
				emptyText='No payouts.'
				id='PayoutsView-payouts'
			/>
		{/if}
	{/snippet}
</EntityView>
