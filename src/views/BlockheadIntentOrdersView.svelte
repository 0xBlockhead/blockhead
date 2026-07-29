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
	}: EntityListViewProps<EntityType.BlockheadIntentOrder> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadIntentOrder}
	bind:open
	resource={
		selection({
			fields: {
				orderId: true,
				providerProtocol: true,
				submittedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadIntentOrder })}
		<EntityView
			entityType={EntityType.BlockheadIntentOrder}
			entitySelector={blockheadIntentOrder[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadIntentOrder.orderId || 'blockhead intent order'}
			{/snippet}

			{#snippet Value()}
				{blockheadIntentOrder.providerProtocol}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadIntentOrder.submittedAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
