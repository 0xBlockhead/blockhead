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
			...{
				fields: {
					timestampMs: true,
					apyTotal: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: erc4626VaultTimestamp })}
		{@const erc4626VaultTimestampSelector = erc4626VaultTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Erc4626Vault_Timestamp}
			entitySelector={erc4626VaultTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/erc-4626/(erc4626Vault)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in erc4626VaultTimestampSelector.$vault.$contract.$network ?
								caip2StringFromValue(erc4626VaultTimestampSelector.$vault.$contract.$network.caip2)
							:
								erc4626VaultTimestampSelector.$vault.$contract.$network.slug
						),
						address: erc4626VaultTimestampSelector.$vault.$contract.address,
						timestampMs: String(erc4626VaultTimestampSelector.timestampMs),
						source: erc4626VaultTimestampSelector.source,
					}
				)
			}
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
