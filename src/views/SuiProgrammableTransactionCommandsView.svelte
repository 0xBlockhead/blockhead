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
	}: EntityListViewProps<EntityType.SuiProgrammableTransactionCommand> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiProgrammableTransactionCommand}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiProgrammableTransactionCommand })}
		{@const suiProgrammableTransactionCommandSelector = suiProgrammableTransactionCommand[EntityMetaKey.Selector]}
		{@const transaction = suiProgrammableTransactionCommandSelector.$transaction}
		<EntityView
			entityType={EntityType.SuiProgrammableTransactionCommand}
			entitySelector={suiProgrammableTransactionCommandSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-tx/[digest=stringSegment]/(suiTransaction)/command/[commandIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$network.$network ?
								caip2StringFromValue(transaction.$network.$network.caip2)
							:
								transaction.$network.$network.slug
						),
						digest: transaction.digest,
						commandIndex: String(suiProgrammableTransactionCommandSelector.commandIndex),
					}
				)
			}
		>
			{#snippet Title()}
				Sui programmable transaction command
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
