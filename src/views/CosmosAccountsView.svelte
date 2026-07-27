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
		<EntityView
			entityType={EntityType.CosmosAccount}
			entitySelector={cosmosAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in cosmosAccountSelector.$network ?
								String(caip2StringFromValue(cosmosAccountSelector.$network.caip2))
							:
								String(cosmosAccountSelector.$network.slug)
						),
						accountId: String(cosmosAccountSelector.address),
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
				<span data-text="annotation">{cosmosAccount.$network.name || (cosmosAccountSelector.$network.caip2 == null ? '' : `${cosmosAccountSelector.$network.caip2.namespace}:${cosmosAccountSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
