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
	}: EntityListViewProps<EntityType.AptosEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosEvent}
	bind:open
	resource={
		selection({
			fields: {
				eventType: true,
				transactionVersion: true,
				eventIndex: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosEvent })}
		{@const aptosEventSelector = aptosEvent[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosEvent}
			entitySelector={aptosEventSelector}
		>
			{#snippet Title()}
				{aptosEvent.eventType || 'aptos event'}
			{/snippet}

			{#snippet Value()}
				{[String(aptosEventSelector.transactionVersion), String(aptosEventSelector.eventIndex)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
