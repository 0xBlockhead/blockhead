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
	}: EntityListViewProps<EntityType.LightningNode_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LightningNode_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				alias: true,
				timestampMs: true,
				capacitySats: true,
			},
		})
	}
>
	{#snippet Item({ item: lightningNodeTimestamp })}
		{@const lightningNodeTimestampSelector = lightningNodeTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LightningNode_Timestamp}
			entitySelector={lightningNodeTimestampSelector}
		>
			{#snippet Title()}
				{[(lightningNodeTimestamp.alias ?? ''), String(lightningNodeTimestampSelector.timestampMs)].filter(Boolean).join(' ') || 'Lightning node timestamp'}
			{/snippet}

			{#snippet Value()}
				{lightningNodeTimestamp.capacitySats ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
