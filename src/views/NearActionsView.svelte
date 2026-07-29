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
	}: EntityListViewProps<EntityType.NearAction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearAction}
	bind:open
	resource={
		selection({
			fields: {
				actionKind: true,
				methodName: true,
				actionIndex: true,
			},
		})
	}
>
	{#snippet Item({ item: nearAction })}
		{@const nearActionSelector = nearAction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearAction}
			entitySelector={nearActionSelector}
		>
			{#snippet Title()}
				{nearAction.actionKind || 'near action'}
			{/snippet}

			{#snippet Value()}
				{nearAction.methodName ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearActionSelector.actionIndex}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
