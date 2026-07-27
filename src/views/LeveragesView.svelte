<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Leverage',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Leverage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Leverage}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				id: true,
				liquidity: true,
				origin: true,
			},
		})
	}
>
	{#snippet Item({ item: leverage })}
		{@const leverageSelector = leverage[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Leverage}
			entitySelector={leverageSelector}
		>
			{#snippet Title()}
				{leverageSelector.id || 'leverage'}
			{/snippet}

			{#snippet Value()}
				{String(leverage.liquidity)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(leverage.origin ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
