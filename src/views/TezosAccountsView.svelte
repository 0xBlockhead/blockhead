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
	}: EntityListViewProps<EntityType.TezosAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosAccount}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosAccount })}
		<EntityView
			entityType={EntityType.TezosAccount}
			entitySelector={tezosAccount[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos account
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
