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
	}: EntityListViewProps<EntityType.MoneroNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroNetwork}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.MoneroDaemonRpc_JsonRpc,
				],
				fields: {
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: moneroNetwork })}
		<EntityView
			entityType={EntityType.MoneroNetwork}
			entitySelector={moneroNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{moneroNetwork.$network.name || (moneroNetwork.$network.caip2 == null ? '' : `${moneroNetwork.$network.caip2.namespace}:${moneroNetwork.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				Monero
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
