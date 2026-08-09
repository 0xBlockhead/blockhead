<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
		{@const migration = bnbBeaconTokenMigrationTimestampSelector.$migration}
		<EntityView
			entityType={EntityType.BnbBeaconTokenMigration_Timestamp}
			entitySelector={bnbBeaconTokenMigrationTimestampSelector}
			href={
				'slug' in migration.$targetNetwork ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/token/[symbol=stringSegment]/(bnbBeaconToken)/migration/[targetNetwork=networkSlug]/[targetAddress=stringSegment]/(bnbBeaconTokenMigration)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							network: (
								'caip2' in migration.$token.$network.$network ?
									caip2StringFromValue(migration.$token.$network.$network.caip2)
								:
									migration.$token.$network.$network.slug
							),
							symbol: migration.$token.symbol,
							targetNetwork: migration.$targetNetwork.slug,
							targetAddress: migration.targetAddress,
							timestampMs: String(bnbBeaconTokenMigrationTimestampSelector.timestampMs),
							source: bnbBeaconTokenMigrationTimestampSelector.source,
						}
					)
				:
					undefined
			}
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
