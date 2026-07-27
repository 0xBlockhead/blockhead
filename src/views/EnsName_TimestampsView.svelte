<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EnsName_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EnsName_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$name: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: ensNameTimestamp })}
		{@const ensNameTimestampSelector = ensNameTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EnsName_Timestamp}
			entitySelector={ensNameTimestampSelector}
			href={
				resolve(
					'/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						ensName: encodeURIComponent(String(ensNameTimestampSelector.$name.name)),
						timestampMs: String(ensNameTimestampSelector.timestampMs),
						source: String(ensNameTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{ensNameTimestampSelector.$name.name || 'ENS name'}
			{/snippet}

			{#snippet Value()}
				{String(ensNameTimestampSelector.timestampMs)}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
