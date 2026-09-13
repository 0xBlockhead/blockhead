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
		{@const token = bnbBeaconTokenMigrationSelector.$token}
		<EntityView
			entityType={EntityType.BnbBeaconTokenMigration}
			entitySelector={bnbBeaconTokenMigrationSelector}
			href={
				bnbBeaconTokenMigrationSelector.$targetNetwork.slug !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/token/[symbol=stringSegment]/(bnbBeaconToken)/migration/[targetNetwork=networkSlug]/[targetAddress=stringSegment]',
						{
							network: (
								token.$network.$network.caip2 !== undefined ?
									caip2StringFromValue(token.$network.$network.caip2)
								:
									token.$network.$network.slug
							),
							symbol: token.symbol,
							targetNetwork: bnbBeaconTokenMigrationSelector.$targetNetwork.slug,
							targetAddress: bnbBeaconTokenMigrationSelector.targetAddress,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{bnbBeaconTokenMigration.migrationKind || 'bnb beacon token migration'}
			{/snippet}

			{#snippet Value()}
				{[bnbBeaconTokenMigrationSelector.$token.symbol || 'bnb beacon token', bnbBeaconTokenMigration.$targetNetwork.name || (bnbBeaconTokenMigration.$targetNetwork.caip2 == null ? '' : `${bnbBeaconTokenMigration.$targetNetwork.caip2.namespace}:${bnbBeaconTokenMigration.$targetNetwork.caip2.reference}`) || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
