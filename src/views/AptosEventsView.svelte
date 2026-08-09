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
	}: EntityListViewProps<EntityType.AptosEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosEvent}
	bind:open
	resource={
		selection({
			...{
				fields: {
					eventType: true,
					transactionVersion: true,
					eventIndex: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: aptosEvent })}
		{@const aptosEventSelector = aptosEvent[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosEvent}
			entitySelector={aptosEventSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/[transactionVersion=nonNegativeBigInt]/event/[eventIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in aptosEventSelector.$network.$network ?
								caip2StringFromValue(aptosEventSelector.$network.$network.caip2)
							:
								aptosEventSelector.$network.$network.slug
						),
						transactionVersion: String(aptosEventSelector.transactionVersion),
						eventIndex: String(aptosEventSelector.eventIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{aptosEvent.eventType || 'aptos event'}
			{/snippet}

			{#snippet Value()}
				{[String(aptosEventSelector.transactionVersion), String(aptosEventSelector.eventIndex)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
