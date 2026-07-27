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
	}: EntityListViewProps<EntityType.AptosBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosBlock}
	bind:open
	resource={
		selection({
			fields: {
				height: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosBlock })}
		{@const aptosBlockSelector = aptosBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosBlock}
			entitySelector={aptosBlockSelector}
		>
			{#snippet Title()}
				{String(aptosBlockSelector.height) || 'aptos block'}
			{/snippet}

			{#snippet Value()}
				{String(aptosBlock.timestampMs)}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
