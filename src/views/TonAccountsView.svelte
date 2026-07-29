<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.TonAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonAccount}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonAccount })}
		{@const tonAccountSelector = tonAccount[EntityMetaKey.Selector]}
		{@const network = tonAccountSelector.$network}
		<EntityView
			entityType={EntityType.TonAccount}
			entitySelector={tonAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						accountId: tonAccountSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				TON account
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
