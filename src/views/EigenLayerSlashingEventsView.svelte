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
	}: EntityListViewProps<EntityType.EigenLayerSlashingEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerSlashingEvent}
	bind:open
	resource={
		selection({
			fields: {
				$operator: true,
				$avs: true,
				slashedShares: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerSlashingEvent })}
		<EntityView
			entityType={EntityType.EigenLayerSlashingEvent}
			entitySelector={eigenLayerSlashingEvent[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{(eigenLayerSlashingEvent.$operator == null ? '' : eigenLayerSlashingEvent.$operator.operatorAddress || 'eigen layer operator') || 'eigen layer slashing event'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerSlashingEvent.$avs == null ? '' : eigenLayerSlashingEvent.$avs.avsAddress || 'eigen layer avs'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerSlashingEvent.slashedShares ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
