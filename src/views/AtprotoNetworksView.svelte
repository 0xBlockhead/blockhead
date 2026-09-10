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
	}: EntityListViewProps<EntityType.AtprotoNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AtprotoNetwork}
	bind:open
	resource={
		selection({
			fields: {
				protocolName: true,
			},
		})
	}
>
	{#snippet Item({ item: atprotoNetwork })}
		<EntityView
			entityType={EntityType.AtprotoNetwork}
			entitySelector={atprotoNetwork[EntityMetaKey.Selector]}
			href={resolve('/(social)/(atproto)/atproto/(globalAtprotoNetwork)/network')}
		>
			{#snippet Title()}
				{atprotoNetwork.protocolName || 'AT Protocol'}
			{/snippet}

			{#snippet Value()}
				AT Protocol
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
