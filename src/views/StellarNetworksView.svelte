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
	}: EntityListViewProps<EntityType.StellarNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarNetwork}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$network: true,
					passphrase: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: stellarNetwork })}
		<EntityView
			entityType={EntityType.StellarNetwork}
			entitySelector={stellarNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{stellarNetwork.$network.name || `${stellarNetwork.$network.caip2.namespace}:${stellarNetwork.$network.caip2.reference}` || 'Network'}
			{/snippet}

			{#snippet Value()}
				{stellarNetwork.passphrase ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
