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
		id = 'AssetEligibilities-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AssetEligibility> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AssetEligibility}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				canHold: true,
				canSend: true,
				canReceive: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: assetEligibility })}
		{@const assetEligibilitySelector = assetEligibility[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AssetEligibility}
			entitySelector={assetEligibilitySelector}
		>
			{#snippet Title()}
				{String(assetEligibilitySelector.timestampMs) || 'asset eligibility'}
			{/snippet}

			{#snippet Value()}
				{[String(assetEligibility.canHold ?? ''), String(assetEligibility.canSend ?? ''), String(assetEligibility.canReceive ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{assetEligibilitySelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
