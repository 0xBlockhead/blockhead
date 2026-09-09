<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'dYdX chain subaccounts',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainSubaccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainSubaccount}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				$account: true,
				subaccountNumber: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainSubaccount })}
		{@const dydxChainSubaccountSelector = dydxChainSubaccount[EntityMetaKey.Selector]}
		{@const account = dydxChainSubaccountSelector.$account}
		<EntityView
			entityType={EntityType.DydxChainSubaccount}
			entitySelector={dydxChainSubaccountSelector}
			href={
				'caip2' in account.$network ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[accountAddress=stringSegment]/subaccount/[subaccountNumber=nonNegativeInteger]',
						{
							network: String(account.$network.caip2),
							accountAddress: account.address,
							subaccountNumber: String(dydxChainSubaccountSelector.subaccountNumber),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{dydxChainSubaccountSelector.$account.address || 'Cosmos account'}
			{/snippet}

			{#snippet Value()}
				{dydxChainSubaccountSelector.subaccountNumber}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
