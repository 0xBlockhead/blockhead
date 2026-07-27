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
	}: EntityListViewProps<EntityType.LightningChannel_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LightningChannel_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				capacitySats: true,
			},
		})
	}
>
	{#snippet Item({ item: lightningChannelTimestamp })}
		{@const lightningChannelTimestampSelector = lightningChannelTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LightningChannel_Timestamp}
			entitySelector={lightningChannelTimestampSelector}
		>
			{#snippet Title()}
				{String(lightningChannelTimestampSelector.timestampMs) || 'Lightning channel timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(lightningChannelTimestamp.status ?? ''), String(lightningChannelTimestamp.capacitySats ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
