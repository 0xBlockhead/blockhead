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
	}: EntityListViewProps<EntityType.KaspaAcceptedTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaAcceptedTransaction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaAcceptedTransaction })}
		<EntityView
			entityType={EntityType.KaspaAcceptedTransaction}
			entitySelector={kaspaAcceptedTransaction[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				kaspa accepted transaction
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
