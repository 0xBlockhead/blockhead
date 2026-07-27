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
	}: EntityListViewProps<EntityType.RadicleSignedRef> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleSignedRef}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radicleSignedRef })}
		<EntityView
			entityType={EntityType.RadicleSignedRef}
			entitySelector={radicleSignedRef[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				radicle signed ref
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
