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
	}: EntityListViewProps<EntityType.AptosAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosAccount}
	bind:open
	resource={
		selection({
			...{
				fields: {
					address: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: aptosAccount })}
		{@const aptosAccountSelector = aptosAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosAccount}
			entitySelector={aptosAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in aptosAccountSelector.$network.$network ?
								caip2StringFromValue(aptosAccountSelector.$network.$network.caip2)
							:
								aptosAccountSelector.$network.$network.slug
						),
						accountId: aptosAccountSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{aptosAccountSelector.address || 'aptos account'}
			{/snippet}

			{#snippet Value()}
				{aptosAccount.$network.$network.name || (aptosAccount.$network.$network.caip2 == null ? '' : `${aptosAccount.$network.$network.caip2.namespace}:${aptosAccount.$network.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
