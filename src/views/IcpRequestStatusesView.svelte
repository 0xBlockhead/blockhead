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
		id = 'IcpRequestStatuses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.IcpRequestStatus> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpRequestStatus}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpRequestStatus })}
		<EntityView
			entityType={EntityType.IcpRequestStatus}
			entitySelector={icpRequestStatus[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP request status
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
