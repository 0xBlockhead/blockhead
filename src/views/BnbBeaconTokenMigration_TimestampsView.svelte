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
	}: EntityListViewProps<EntityType.BnbBeaconTokenMigration_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconTokenMigration_Timestamp}
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
	{#snippet Item({ item: bnbBeaconTokenMigrationTimestamp })}
		{@const bnbBeaconTokenMigrationTimestampSelector = bnbBeaconTokenMigrationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbBeaconTokenMigration_Timestamp}
			entitySelector={bnbBeaconTokenMigrationTimestampSelector}
		>
			{#snippet Title()}
				{bnbBeaconTokenMigrationTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{bnbBeaconTokenMigrationTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bnbBeaconTokenMigrationTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
