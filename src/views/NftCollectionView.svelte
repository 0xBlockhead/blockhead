<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.NftCollection> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NftTokensView from '$/views/NftTokensView.svelte'
	import RoyaltyRight_TimestampsView from '$/views/RoyaltyRight_TimestampsView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.NftCollection}
	entitySelector={selection.entitySelector}
	title={title ?? 'NFT collection'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		NFT collection
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
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
