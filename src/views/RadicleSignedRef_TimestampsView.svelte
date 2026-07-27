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
	}: EntityListViewProps<EntityType.RadicleSignedRef_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleSignedRef_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radicleSignedRefTimestamp })}
		<EntityView
			entityType={EntityType.RadicleSignedRef_Timestamp}
			entitySelector={radicleSignedRefTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				radicle signed ref timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
