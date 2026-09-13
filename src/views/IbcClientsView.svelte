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
	}: EntityListViewProps<EntityType.IbcClient> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IbcClient}
	bind:open
	resource={
		selection({
			fields: {
				clientId: true,
				clientType: true,
				counterpartyChainId: true,
			},
		})
	}
>
	{#snippet Item({ item: ibcClient })}
		{@const ibcClientSelector = ibcClient[EntityMetaKey.Selector]}
		{@const network = ibcClientSelector.$network}
		<EntityView
			entityType={EntityType.IbcClient}
			entitySelector={ibcClientSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-clients/[clientId=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						clientId: ibcClientSelector.clientId,
					}
				)
			}
		>
			{#snippet Title()}
				{ibcClientSelector.clientId || 'IBC client'}
			{/snippet}

			{#snippet Value()}
				{[(ibcClient.clientType ?? ''), ibcClientSelector.clientId].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{ibcClient.counterpartyChainId ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
