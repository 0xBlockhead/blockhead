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
	}: EntityListViewProps<EntityType.ElementsPeg> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ElementsPeg}
	bind:open
	resource={
		selection({
			fields: {
				direction: true,
				pegTransactionId: true,
				amountSats: true,
			},
		})
	}
>
	{#snippet Item({ item: elementsPeg })}
		{@const elementsPegSelector = elementsPeg[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ElementsPeg}
			entitySelector={elementsPegSelector}
		>
			{#snippet Title()}
				{[elementsPegSelector.direction, elementsPegSelector.pegTransactionId].filter(Boolean).join(' ') || 'Elements peg'}
			{/snippet}

			{#snippet Value()}
				{elementsPeg.amountSats ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
