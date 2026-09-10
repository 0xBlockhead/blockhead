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
		title = 'Accounts',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosAccount}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				address: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosAccount })}
		{@const cosmosAccountSelector = cosmosAccount[EntityMetaKey.Selector]}
		{@const network = cosmosAccountSelector.$network}
		<EntityView
			entityType={EntityType.CosmosAccount}
			entitySelector={cosmosAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						accountId: cosmosAccountSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{cosmosAccountSelector.address || 'Cosmos account'}
			{/snippet}

			{#snippet Value()}
				{cosmosAccountSelector.address}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosAccount.$network.name || (cosmosAccount.$network.caip2 == null ? '' : `${cosmosAccount.$network.caip2.namespace}:${cosmosAccount.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
