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
		id = 'KaspaAddresses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.KaspaAddress> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaAddress}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaAddress })}
		<EntityView
			entityType={EntityType.KaspaAddress}
			entitySelector={kaspaAddress[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				kaspa address
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
