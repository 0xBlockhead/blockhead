<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		<EntityView
			entityType={EntityType.AssetFormatSupport_Timestamp}
			entitySelector={assetFormatSupportTimestampSelector}
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
