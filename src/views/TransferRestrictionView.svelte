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
	}: Omit<EntitySelectionViewProps<EntityType.TransferRestriction>, 'prefetched'> = $props()

	const assetInstance = $derived(selection.entitySelector.$assetInstance)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TransferRestrictionCheck_TimestampsView from '$/views/TransferRestrictionCheck_TimestampsView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.TransferRestriction}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/restriction/[restrictionKey=stringSegment]/[restrictionSource=stringSegment]',
				{
					network: (
						'caip2' in assetInstance.$network ?
							caip2StringFromValue(assetInstance.$network.caip2)
						:
							assetInstance.$network.slug
					),
					kind: assetInstance.kind,
					assetKey: assetInstance.assetKey,
					restrictionKey: selection.entitySelector.restrictionKey,
					restrictionSource: selection.entitySelector.source,
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
						{@const regulatedAssetProfileInitial = untrack(() => regulatedAssetProfile)}
						<div>
							<dt>profile</dt>
							<dd>
								<RegulatedAssetProfileView
									selection={select(EntityType.RegulatedAssetProfile, (regulatedAssetProfile ?? regulatedAssetProfileInitial)[EntityMetaKey.Selector])}
									prefetched={regulatedAssetProfile ?? regulatedAssetProfileInitial}
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

	{#snippet Details()}
		{@const checksResource = selection.$$checks}
		<ResourceBoundary
			resource={checksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<TransferRestrictionCheck_TimestampsView
						selection={checksResource}
						countResource={checksResource.count}
						title='checks'
						id='checks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
