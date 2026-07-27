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
	}: EntityListViewProps<EntityType.ElementsIssuance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ElementsIssuance}
	bind:open
	resource={
		selection({
			fields: {
				inputIndex: true,
				$asset: true,
				$reissuanceTokenAsset: true,
				isReissuance: true,
			},
		})
	}
>
	{#snippet Item({ item: elementsIssuance })}
		{@const elementsIssuanceSelector = elementsIssuance[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ElementsIssuance}
			entitySelector={elementsIssuanceSelector}
		>
			{#snippet Title()}
				{String(elementsIssuanceSelector.inputIndex) || 'Elements issuance'}
			{/snippet}

			{#snippet Value()}
				{[elementsIssuance.$asset == null ? '' : [(elementsIssuance.$asset.name ?? ''), (elementsIssuance.$asset.ticker ?? ''), elementsIssuance.$asset.assetId].filter(Boolean).join(' ') || 'Elements asset', elementsIssuance.$reissuanceTokenAsset == null ? '' : [(elementsIssuance.$reissuanceTokenAsset.name ?? ''), (elementsIssuance.$reissuanceTokenAsset.ticker ?? ''), elementsIssuance.$reissuanceTokenAsset.assetId].filter(Boolean).join(' ') || 'Elements asset'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(elementsIssuance.isReissuance ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
