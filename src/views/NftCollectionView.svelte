<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.NftCollection>, 'prefetched'> = $props()

	const assetInstance = $derived(selection.entitySelector.$assetInstance)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NftTokensView from '$/views/NftTokensView.svelte'
	import RoyaltyRight_TimestampsView from '$/views/RoyaltyRight_TimestampsView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.NftCollection}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/collection',
				{
					network: (
						'caip2' in assetInstance.$network ?
							caip2StringFromValue(assetInstance.$network.caip2)
						:
							assetInstance.$network.slug
					),
					kind: assetInstance.kind,
					assetKey: assetInstance.assetKey,
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
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const tokensResource = selection.$$tokens}
		<ResourceBoundary
			resource={tokensResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NftTokensView
						selection={tokensResource}
						countResource={tokensResource.count}
						title='tokens'
						id='tokens'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const royaltyTimestampsResource = selection.$$royaltyTimestamps}
		<ResourceBoundary
			resource={royaltyTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RoyaltyRight_TimestampsView
						selection={royaltyTimestampsResource}
						countResource={royaltyTimestampsResource.count}
						title='royalty timestamps'
						id='royalty-timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
