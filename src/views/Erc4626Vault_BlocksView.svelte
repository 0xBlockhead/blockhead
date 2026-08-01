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
	}: EntityListViewProps<EntityType.Erc4626Vault_Block> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4626Vault_Block}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: erc4626VaultBlock })}
		{@const erc4626VaultBlockSelector = erc4626VaultBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Erc4626Vault_Block}
			entitySelector={erc4626VaultBlockSelector}
		>
			{#snippet Title()}
				{erc4626VaultBlockSelector.blockNumber}
			{/snippet}

			{#snippet Value()}
				{erc4626VaultBlockSelector.source}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
