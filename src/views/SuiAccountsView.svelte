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
	}: EntityListViewProps<EntityType.SuiAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiAccount}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiAccount })}
		<EntityView
			entityType={EntityType.SuiAccount}
			entitySelector={suiAccount[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui account
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
