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
	}: EntityListViewProps<EntityType.NearNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				headHeight: true,
				headHash: true,
			},
		})
	}
>
	{#snippet Item({ item: nearNetworkTimestamp })}
		{@const nearNetworkTimestampSelector = nearNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearNetwork_Timestamp}
			entitySelector={nearNetworkTimestampSelector}
		>
			{#snippet Title()}
				{String(nearNetworkTimestampSelector.timestampMs) || 'near network timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(nearNetworkTimestamp.headHeight ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(nearNetworkTimestamp.headHash ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
