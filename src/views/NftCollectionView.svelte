<!-- Generated from APP.ts. -->

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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.NftCollection> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.NftCollection}
	entitySelector={selection.entitySelector}
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
					<EntitiesList
						entityType={EntityType.NftToken}
						countResource={tokensResource.count}
						title='tokens'
						open={true}
						id='tokens'
						resource={tokensResource()}
					>
						{#snippet Item({ item: nftToken })}
							<EntityView
								entityType={EntityType.NftToken}
								entitySelector={nftToken[EntityMetaKey.Selector]}
							/>
						{/snippet}
					</EntitiesList>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const royaltyTimestampsResource = selection.$$royaltyTimestamps}
		<ResourceBoundary
			resource={royaltyTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EntitiesList
						entityType={EntityType.RoyaltyRight_Timestamp}
						countResource={royaltyTimestampsResource.count}
						title='royalty timestamps'
						open={true}
						id='royalty-timestamps'
						resource={royaltyTimestampsResource()}
					>
						{#snippet Item({ item: royaltyRightTimestamp })}
							<EntityView
								entityType={EntityType.RoyaltyRight_Timestamp}
								entitySelector={royaltyRightTimestamp[EntityMetaKey.Selector]}
							/>
						{/snippet}
					</EntitiesList>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
