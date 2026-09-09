<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AssetFormatSupport_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AssetFormatSupport_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				formatId: true,
				confidence: true,
			},
		})
	}
>
	{#snippet Item({ item: assetFormatSupportTimestamp })}
		{@const assetFormatSupportTimestampSelector = assetFormatSupportTimestamp[EntityMetaKey.Selector]}
		{@const assetInstance = assetFormatSupportTimestampSelector.$assetInstance}
		<EntityView
			entityType={EntityType.AssetFormatSupport_Timestamp}
			entitySelector={assetFormatSupportTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/format/[formatId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in assetInstance.$network ?
								caip2StringFromValue(assetInstance.$network.caip2)
							:
								assetInstance.$network.slug
						),
						kind: assetInstance.kind,
						assetKey: assetInstance.assetKey,
						formatId: assetFormatSupportTimestampSelector.formatId,
						timestampMs: String(assetFormatSupportTimestampSelector.timestampMs),
						source: assetFormatSupportTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{assetFormatSupportTimestampSelector.formatId || 'asset format support timestamp'}
			{/snippet}

			{#snippet Value()}
				{assetFormatSupportTimestampSelector.formatId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{assetFormatSupportTimestamp.confidence ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
