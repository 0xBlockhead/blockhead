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
			fields: {
				$record: {
					fields: {
						$name: true,
					},
				},
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: ensRecordTimestamp })}
		{@const ensRecordTimestampSelector = ensRecordTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EnsRecord_Timestamp}
			entitySelector={ensRecordTimestampSelector}
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
