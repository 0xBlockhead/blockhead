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
	}: EntityListViewProps<EntityType.LensNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensNetwork}
	bind:open
	resource={
		selection({
			fields: {
				protocolName: true,
			},
		})
	}
>
	{#snippet Item({ item: lensNetwork })}
		<EntityView
			entityType={EntityType.LensNetwork}
			entitySelector={lensNetwork[EntityMetaKey.Selector]}
			href={resolve('/(social)/(lens)/lens')}
		>
			{#snippet Title()}
				{lensNetwork.protocolName || 'Lens'}
			{/snippet}

			{#snippet Value()}
				Lens
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
