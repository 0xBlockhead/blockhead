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
	}: EntityListViewProps<EntityType.FinancialProtocol> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FinancialProtocol}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				protocolKey: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: financialProtocol })}
		{@const financialProtocolSelector = financialProtocol[EntityMetaKey.Selector]}
		{@const network = financialProtocolSelector.$network}
		<EntityView
			entityType={EntityType.FinancialProtocol}
			entitySelector={financialProtocolSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/financial-protocol/[protocolKey=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						protocolKey: financialProtocolSelector.protocolKey,
					}
				)
			}
		>
			{#snippet Title()}
				{financialProtocol.name || financialProtocolSelector.protocolKey || 'financial protocol'}
			{/snippet}

			{#snippet Value()}
				{[financialProtocolSelector.protocolKey, financialProtocol.$network.name || (financialProtocol.$network.caip2 == null ? '' : `${financialProtocol.$network.caip2.namespace}:${financialProtocol.$network.caip2.reference}`) || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
