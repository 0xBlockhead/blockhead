<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.TonTransactionPhase> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonTransactionPhase}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonTransactionPhase })}
		<EntityView
			entityType={EntityType.TonTransactionPhase}
			entitySelector={tonTransactionPhase[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON transaction phase
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
