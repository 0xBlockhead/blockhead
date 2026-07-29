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
	}: EntityListViewProps<EntityType.Erc4626Vault_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4626Vault_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				apyTotal: true,
			},
		})
	}
>
	{#snippet Item({ item: erc4626VaultTimestamp })}
		{@const erc4626VaultTimestampSelector = erc4626VaultTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Erc4626Vault_Timestamp}
			entitySelector={erc4626VaultTimestampSelector}
		>
			{#snippet Title()}
				{erc4626VaultTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{erc4626VaultTimestamp.apyTotal ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
