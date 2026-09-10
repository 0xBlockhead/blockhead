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
		title = 'Contracts',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosContract}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				address: true,
				codeId: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosContract })}
		{@const cosmosContractSelector = cosmosContract[EntityMetaKey.Selector]}
		{@const network = cosmosContractSelector.$network}
		<EntityView
			entityType={EntityType.CosmosContract}
			entitySelector={cosmosContractSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						address: cosmosContractSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{cosmosContractSelector.address || 'Cosmos contract'}
			{/snippet}

			{#snippet Value()}
				{cosmosContractSelector.address}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosContract.codeId ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
