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
	}: EntityListViewProps<EntityType.MoveStruct> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoveStruct}
	bind:open
	resource={
		selection({
			fields: {
				structName: true,
				isEvent: true,
				isNative: true,
				$module: true,
			},
		})
	}
>
	{#snippet Item({ item: moveStruct })}
		{@const moveStructSelector = moveStruct[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MoveStruct}
			entitySelector={moveStructSelector}
		>
			{#snippet Title()}
				{moveStructSelector.structName || 'move struct'}
			{/snippet}

			{#snippet Value()}
				{[String(moveStruct.isEvent ?? ''), String(moveStruct.isNative ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moveStructSelector.$module.moduleName || 'move module'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
