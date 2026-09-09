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
		id = 'GlobalActivityPubNetworks-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalActivityPubNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalActivityPubNetwork}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				scope: true,
			},
		})
	}
>
	{#snippet Item({ item: globalActivityPubNetwork })}
		{@const globalActivityPubNetworkSelector = globalActivityPubNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalActivityPubNetwork}
			entitySelector={globalActivityPubNetworkSelector}
			href={resolve('/(social)/(activitypub)/activitypub')}
		>
			{#snippet Value()}
				{globalActivityPubNetworkSelector.scope}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
