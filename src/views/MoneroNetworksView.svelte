<!-- Generated from APP.ts. Do not edit by hand. -->

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
			sources: selection.sources ?? [
				Source.MoneroDaemonRpc_JsonRpc,
			],
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: moneroNetwork })}
		{@const moneroNetworkSelector = moneroNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MoneroNetwork}
			entitySelector={moneroNetworkSelector}
		>
			{#snippet Title()}
				{moneroNetwork.$network.name || (moneroNetworkSelector.$network.caip2 == null ? '' : `${moneroNetworkSelector.$network.caip2.namespace}:${moneroNetworkSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				Monero
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
