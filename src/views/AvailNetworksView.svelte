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
	}: EntityListViewProps<EntityType.AvailNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvailNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: availNetwork })}
		{@const availNetworkSelector = availNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvailNetwork}
			entitySelector={availNetworkSelector}
		>
			{#snippet Title()}
				{availNetwork.$network.name || (availNetworkSelector.$network.caip2 == null ? '' : `${availNetworkSelector.$network.caip2.namespace}:${availNetworkSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				Avail
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
