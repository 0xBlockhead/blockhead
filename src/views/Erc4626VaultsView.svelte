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
	}: EntityListViewProps<EntityType.Erc4626Vault> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4626Vault}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				symbol: true,
				$asset: true,
			},
		})
	}
>
	{#snippet Item({ item: erc4626Vault })}
		<EntityView
			entityType={EntityType.Erc4626Vault}
			entitySelector={erc4626Vault[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{[(erc4626Vault.name ?? ''), (erc4626Vault.symbol ?? '')].filter(Boolean).join(' ') || 'erc4626 vault'}
			{/snippet}

			{#snippet Value()}
				{erc4626Vault.$asset == null ? '' : [erc4626Vault.$asset.NativeCurrency.symbol, (erc4626Vault.$asset.NativeCurrency.name ?? ''), erc4626Vault.$asset.Erc20Token.symbol, (erc4626Vault.$asset.Erc20Token.name ?? '')].filter(Boolean).join(' ') || 'EVM coin instance'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
