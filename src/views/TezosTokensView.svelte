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
	}: EntityListViewProps<EntityType.TezosToken> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosToken}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosToken })}
		<EntityView
			entityType={EntityType.TezosToken}
			entitySelector={tezosToken[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos token
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
