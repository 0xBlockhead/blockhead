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
	}: EntityListViewProps<EntityType.AptosAccountResource> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosAccountResource}
	bind:open
	resource={
		selection({
			fields: {
				resourceType: true,
				$account: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosAccountResource })}
		{@const aptosAccountResourceSelector = aptosAccountResource[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosAccountResource}
			entitySelector={aptosAccountResourceSelector}
		>
			{#snippet Title()}
				{aptosAccountResourceSelector.resourceType || 'aptos account resource'}
			{/snippet}

			{#snippet Value()}
				{aptosAccountResourceSelector.$account.address || 'aptos account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
