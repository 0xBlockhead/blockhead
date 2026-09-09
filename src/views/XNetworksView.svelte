<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.XNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XNetwork}
	bind:open
	resource={
		selection({
			fields: {
				protocolName: true,
			},
		})
	}
>
	{#snippet Item({ item: xNetwork })}
		{@const xNetworkSelector = xNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XNetwork}
			entitySelector={xNetworkSelector}
			href={
				xNetworkSelector.scope === 'XNetwork' ?
					resolve('/(social)/(x)/x')
				:
					undefined
			}
		>
			{#snippet Title()}
				{xNetwork.protocolName || 'X'}
			{/snippet}

			{#snippet Value()}
				X
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
