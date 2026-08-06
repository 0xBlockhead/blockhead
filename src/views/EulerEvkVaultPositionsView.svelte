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
	}: EntityListViewProps<EntityType.EulerEvkVaultPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EulerEvkVaultPosition}
	bind:open
	resource={
		selection({
			fields: {
				$vault: true,
				assets: true,
				borrowed: true,
			},
		})
	}
>
	{#snippet Item({ item: eulerEvkVaultPosition })}
		<EntityView
			entityType={EntityType.EulerEvkVaultPosition}
			entitySelector={eulerEvkVaultPosition[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{[eulerEvkVaultPosition.$vault.name, eulerEvkVaultPosition.$vault.symbol].filter(Boolean).join(' ') || 'Euler EVK vault'}
			{/snippet}

			{#snippet Value()}
				{[eulerEvkVaultPosition.assets, eulerEvkVaultPosition.borrowed].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
