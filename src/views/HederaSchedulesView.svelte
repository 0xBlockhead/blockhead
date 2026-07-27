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
	}: EntityListViewProps<EntityType.HederaSchedule> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaSchedule}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaSchedule })}
		<EntityView
			entityType={EntityType.HederaSchedule}
			entitySelector={hederaSchedule[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera schedule
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
