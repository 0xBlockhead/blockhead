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
	}: EntityListViewProps<EntityType.EnsRecord_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EnsRecord_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$record: {
						fields: {
							$name: true,
						},
					},
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: ensRecordTimestamp })}
		{@const ensRecordTimestampSelector = ensRecordTimestamp[EntityMetaKey.Selector]}
		{@const record = ensRecordTimestampSelector.$record}
		<EntityView
			entityType={EntityType.EnsRecord_Timestamp}
			entitySelector={ensRecordTimestampSelector}
			href={
				resolve(
					'/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]/(ensRecord)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						ensName: encodeURIComponent(record.$name.name),
						recordId: encodeURIComponent(record.recordKey),
						timestampMs: String(ensRecordTimestampSelector.timestampMs),
						source: ensRecordTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{ensRecordTimestampSelector.$record.recordKey || 'ENS record'}
			{/snippet}

			{#snippet Value()}
				{ensRecordTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
