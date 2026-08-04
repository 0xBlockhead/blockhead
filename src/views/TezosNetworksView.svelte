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
	}: EntityListViewProps<EntityType.TezosNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: tezosNetwork })}
		<EntityView
			entityType={EntityType.TezosNetwork}
			entitySelector={tezosNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{tezosNetwork.$network.name || (tezosNetwork.$network.caip2 == null ? '' : `${tezosNetwork.$network.caip2.namespace}:${tezosNetwork.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
