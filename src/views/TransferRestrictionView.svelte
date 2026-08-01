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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TransferRestriction> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.TransferRestriction}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
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

			<div>
				<dt>restriction key</dt>
				<dd>
					{selection.entitySelector.restrictionKey}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>restriction kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									restrictionKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.restrictionKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$profile}
			>
				{#snippet children(regulatedAssetProfile)}
					{#if regulatedAssetProfile != null}
						<div>
							<dt>profile</dt>
							<dd>
								<RegulatedAssetProfileView
									selection={select(EntityType.RegulatedAssetProfile, regulatedAssetProfile[EntityMetaKey.Selector])}
									prefetched={regulatedAssetProfile}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							message: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const message = entity.message}
					{#if message != null}
						<div>
							<dt>message</dt>
							<dd>
								{message}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const checksResource = selection.$$checks}
		<ResourceBoundary
			resource={checksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EntitiesList
						entityType={EntityType.TransferRestrictionCheck_Timestamp}
						countResource={checksResource.count}
						title='checks'
						open={true}
						id='checks'
						resource={checksResource()}
					>
						{#snippet Item({ item: transferRestrictionCheckTimestamp })}
							<EntityView
								entityType={EntityType.TransferRestrictionCheck_Timestamp}
								entitySelector={transferRestrictionCheckTimestamp[EntityMetaKey.Selector]}
							/>
						{/snippet}
					</EntitiesList>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
