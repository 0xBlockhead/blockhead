<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.EnsName> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EnsName}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
			},
		})
	}
>
	{#snippet Item({ item: ensName })}
		{@const ensNameSelector = ensName[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EnsName}
			entitySelector={ensNameSelector}
			href={
				resolve(
					'/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]',
					{
						ensName: encodeURIComponent(String(ensNameSelector.name)),
					}
				)
			}
		>
			{#snippet Title()}
				{ensNameSelector.name || 'ENS name'}
			{/snippet}

			{#snippet Value()}
				{ensNameSelector.name}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
