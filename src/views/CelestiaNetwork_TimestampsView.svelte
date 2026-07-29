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
	}: EntityListViewProps<EntityType.CelestiaNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				latestHeight: true,
				health: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: celestiaNetworkTimestamp })}
		{@const celestiaNetworkTimestampSelector = celestiaNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CelestiaNetwork_Timestamp}
			entitySelector={celestiaNetworkTimestampSelector}
		>
			{#snippet Title()}
				{celestiaNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(celestiaNetworkTimestamp.latestHeight ?? ''), (celestiaNetworkTimestamp.health ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{celestiaNetworkTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
