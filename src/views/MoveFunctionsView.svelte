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
		...EntitiesListProps
	}: EntityListViewProps<EntityType.MoveFunction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoveFunction}
	bind:open
	resource={
		selection({
			fields: {
				functionName: true,
				visibility: true,
				$module: true,
			},
		})
	}
>
	{#snippet Item({ item: moveFunction })}
		{@const moveFunctionSelector = moveFunction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MoveFunction}
			entitySelector={moveFunctionSelector}
		>
			{#snippet Title()}
				{moveFunctionSelector.functionName || 'move function'}
			{/snippet}

			{#snippet Value()}
				{(moveFunction.visibility ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moveFunctionSelector.$module.moduleName || 'move module'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
