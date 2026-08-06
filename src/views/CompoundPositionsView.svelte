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
	}: EntityListViewProps<EntityType.CompoundPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CompoundPosition}
	bind:open
	resource={
		selection({
			fields: {
				$comet: true,
				baseTokenSymbol: true,
				suppliedBalance: true,
				borrowedBalance: true,
			},
		})
	}
>
	{#snippet Item({ item: compoundPosition })}
		<EntityView
			entityType={EntityType.CompoundPosition}
			entitySelector={compoundPosition[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{[compoundPosition.$comet.name || 'Compound Comet market', compoundPosition.baseTokenSymbol].filter(Boolean).join(' ') || 'Compound position'}
			{/snippet}

			{#snippet Value()}
				{[(compoundPosition.suppliedBalance ?? ''), (compoundPosition.borrowedBalance ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
