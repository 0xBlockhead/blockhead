<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		id = 'StarknetClasses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.StarknetClass> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetClass}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				classHash: true,
				contractClassVersion: true,
				declaredAtBlockNumber: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetClass })}
		{@const starknetClassSelector = starknetClass[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetClass}
			entitySelector={starknetClassSelector}
		>
			{#snippet Title()}
				{starknetClassSelector.classHash || 'starknet class'}
			{/snippet}

			{#snippet Value()}
				{(starknetClass.contractClassVersion ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(starknetClass.declaredAtBlockNumber ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
