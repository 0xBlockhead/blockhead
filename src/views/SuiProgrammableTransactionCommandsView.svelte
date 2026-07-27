<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		<EntityView
			entityType={EntityType.SuiProgrammableTransactionCommand}
			entitySelector={suiProgrammableTransactionCommand[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui programmable transaction command
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
