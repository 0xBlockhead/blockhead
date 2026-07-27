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
	}: EntityListViewProps<EntityType.IcpCertifiedState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCertifiedState}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCertifiedState })}
		<EntityView
			entityType={EntityType.IcpCertifiedState}
			entitySelector={icpCertifiedState[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP certified state
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
