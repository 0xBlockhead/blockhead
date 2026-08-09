<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.MagnetResolution_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MagnetResolution_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: magnetResolutionTimestamp })}
		{@const magnetResolutionTimestampSelector = magnetResolutionTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MagnetResolution_Timestamp}
			entitySelector={magnetResolutionTimestampSelector}
			href={
				resolve(
					'/magnet/[magnetUri=stringSegment]/(magnetLink)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						magnetUri: magnetResolutionTimestampSelector.magnetUri,
						timestampMs: String(magnetResolutionTimestampSelector.timestampMs),
						source: magnetResolutionTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{magnetResolutionTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{magnetResolutionTimestamp.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{magnetResolutionTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
