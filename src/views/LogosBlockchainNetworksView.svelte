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
	}: EntityListViewProps<EntityType.LogosBlockchainNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LogosBlockchainNetwork}
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
	{#snippet Item({ item: logosBlockchainNetwork })}
		<EntityView
			entityType={EntityType.LogosBlockchainNetwork}
			entitySelector={logosBlockchainNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{logosBlockchainNetwork.$network.name || `${logosBlockchainNetwork.$network.caip2.namespace}:${logosBlockchainNetwork.$network.caip2.reference}` || 'Network'}
			{/snippet}

			{#snippet Value()}
				{logosBlockchainNetwork.$network.name || `${logosBlockchainNetwork.$network.caip2.namespace}:${logosBlockchainNetwork.$network.caip2.reference}` || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
