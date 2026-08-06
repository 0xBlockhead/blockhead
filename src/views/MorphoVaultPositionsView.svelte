<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.MorphoVaultPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MorphoVaultPosition}
	bind:open
	resource={
		selection({
			fields: {
				$vault: true,
				assets: true,
				shares: true,
			},
		})
	}
>
	{#snippet Item({ item: morphoVaultPosition })}
		<EntityView
			entityType={EntityType.MorphoVaultPosition}
			entitySelector={morphoVaultPosition[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{[morphoVaultPosition.$vault.name, morphoVaultPosition.$vault.symbol].filter(Boolean).join(' ') || 'Morpho vault'}
			{/snippet}

			{#snippet Value()}
				{[morphoVaultPosition.assets, morphoVaultPosition.shares].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
