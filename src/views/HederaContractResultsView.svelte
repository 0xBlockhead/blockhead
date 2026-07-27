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
	}: EntityListViewProps<EntityType.HederaContractResult> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaContractResult}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaContractResult })}
		<EntityView
			entityType={EntityType.HederaContractResult}
			entitySelector={hederaContractResult[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera contract result
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
