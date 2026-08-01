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
	}: EntityListViewProps<EntityType.BnbBeaconTokenMigration> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconTokenMigration}
	bind:open
	resource={
		selection({
			fields: {
				migrationKind: true,
				$token: true,
				$targetNetwork: true,
			},
		})
	}
>
	{#snippet Item({ item: bnbBeaconTokenMigration })}
		{@const bnbBeaconTokenMigrationSelector = bnbBeaconTokenMigration[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbBeaconTokenMigration}
			entitySelector={bnbBeaconTokenMigrationSelector}
		>
			{#snippet Title()}
				{bnbBeaconTokenMigration.migrationKind || 'bnb beacon token migration'}
			{/snippet}

			{#snippet Value()}
				{[bnbBeaconTokenMigrationSelector.$token.symbol || 'bnb beacon token', bnbBeaconTokenMigration.$targetNetwork.name || (bnbBeaconTokenMigrationSelector.$targetNetwork.caip2 == null ? '' : `${bnbBeaconTokenMigrationSelector.$targetNetwork.caip2.namespace}:${bnbBeaconTokenMigrationSelector.$targetNetwork.caip2.reference}`) || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
