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
	}: EntityListViewProps<EntityType.KaspaNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaNetwork}
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
	{#snippet Item({ item: kaspaNetwork })}
		<EntityView
			entityType={EntityType.KaspaNetwork}
			entitySelector={kaspaNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{kaspaNetwork.$network.name || (kaspaNetwork.$network.caip2 == null ? '' : `${kaspaNetwork.$network.caip2.namespace}:${kaspaNetwork.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				Kaspa
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
