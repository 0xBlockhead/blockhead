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
	}: EntityListViewProps<EntityType.ArweaveNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ArweaveNetwork}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: arweaveNetwork })}
		<EntityView
			entityType={EntityType.ArweaveNetwork}
			entitySelector={arweaveNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{arweaveNetwork.$network.name || (arweaveNetwork.$network.caip2 == null ? '' : `${arweaveNetwork.$network.caip2.namespace}:${arweaveNetwork.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				Arweave
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
