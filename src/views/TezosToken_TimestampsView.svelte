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
	}: EntityListViewProps<EntityType.TezosToken_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosToken_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosTokenTimestamp })}
		<EntityView
			entityType={EntityType.TezosToken_Timestamp}
			entitySelector={tezosTokenTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos token timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
