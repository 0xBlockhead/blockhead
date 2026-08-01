<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FilecoinNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinNetwork}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Lotus_JsonRpc,
			],
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinNetwork })}
		{@const filecoinNetworkSelector = filecoinNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FilecoinNetwork}
			entitySelector={filecoinNetworkSelector}
		>
			{#snippet Title()}
				{filecoinNetwork.$network.name || (filecoinNetworkSelector.$network.caip2 == null ? '' : `${filecoinNetworkSelector.$network.caip2.namespace}:${filecoinNetworkSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				Filecoin
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
