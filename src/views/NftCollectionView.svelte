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
			selection: EntityProxyResource<typeof schema, EntityType.NftCollection>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NftCollection>>
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
	const nftCollection = $derived(selection({}))
	const titleFallback = $derived('NFT collection')
	const viewDomId = $derived('nft-collection-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NftTokensView from '$/views/NftTokensView.svelte'
	import RoyaltyRight_TimestampsView from '$/views/RoyaltyRight_TimestampsView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.NftCollection}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nftCollection}>
			{#snippet Pending()}
				{title || 'NFT collection'}
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
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance, {})}
						href={
							(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
								network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<NftTokensView
				selection={selection.$$tokens}
				title='tokens'
				emptyText='No NFT tokens.'
				id='NftTokensView-tokens'
			/>

			<RoyaltyRight_TimestampsView
				selection={selection.$$royaltyTimestamps}
				title='royalty timestamps'
				emptyText='No royalty right observations.'
				id='RoyaltyRight_TimestampsView-royalty-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
