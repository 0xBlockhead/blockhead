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
	}: EntityListViewProps<EntityType.FarcasterNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterNetwork}
	bind:open
	resource={
		selection({
			...{
				fields: {
					protocolName: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: farcasterNetwork })}
		<EntityView
			entityType={EntityType.FarcasterNetwork}
			entitySelector={farcasterNetwork[EntityMetaKey.Selector]}
			href={resolve('/(social)/(farcaster)/farcaster')}
		>
			{#snippet Title()}
				{farcasterNetwork.protocolName || 'Farcaster'}
			{/snippet}

			{#snippet Value()}
				Farcaster
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
