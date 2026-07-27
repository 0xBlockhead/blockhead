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
	}: EntityListViewProps<EntityType.FilecoinNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				headHeight: true,
				headTipsetKey: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinNetworkTimestamp })}
		{@const filecoinNetworkTimestampSelector = filecoinNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FilecoinNetwork_Timestamp}
			entitySelector={filecoinNetworkTimestampSelector}
		>
			{#snippet Title()}
				{String(filecoinNetworkTimestampSelector.timestampMs) || 'filecoin network timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(filecoinNetworkTimestamp.headHeight ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(filecoinNetworkTimestamp.headTipsetKey ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
