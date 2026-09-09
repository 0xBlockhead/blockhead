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
	}: EntityListViewProps<EntityType.GitPackfile> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitPackfile}
	bind:open
	resource={
		selection({
			fields: {
				packHash: true,
				objectFormat: true,
			},
		})
	}
>
	{#snippet Item({ item: gitPackfile })}
		{@const gitPackfileSelector = gitPackfile[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitPackfile}
			entitySelector={gitPackfileSelector}
			href={
				resolve(
					'/git/pack/[packHash=zeroExHex]',
					{
						packHash: gitPackfileSelector.packHash,
					}
				)
			}
		>
			{#snippet Title()}
				{gitPackfileSelector.packHash || 'Git packfile'}
			{/snippet}

			{#snippet Value()}
				{gitPackfile.objectFormat}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
