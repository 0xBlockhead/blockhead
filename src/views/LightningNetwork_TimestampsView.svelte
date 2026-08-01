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
	}: EntityListViewProps<EntityType.LightningNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LightningNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				nodeCount: true,
				channelCount: true,
			},
		})
	}
>
	{#snippet Item({ item: lightningNetworkTimestamp })}
		{@const lightningNetworkTimestampSelector = lightningNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LightningNetwork_Timestamp}
			entitySelector={lightningNetworkTimestampSelector}
		>
			{#snippet Title()}
				{lightningNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(lightningNetworkTimestamp.nodeCount ?? ''), String(lightningNetworkTimestamp.channelCount ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
