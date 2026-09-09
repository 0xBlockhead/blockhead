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
	}: EntityListViewProps<EntityType.NetworkUpgrade_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NetworkUpgrade_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				activationHeight: true,
			},
		})
	}
>
	{#snippet Item({ item: networkUpgradeTimestamp })}
		{@const networkUpgradeTimestampSelector = networkUpgradeTimestamp[EntityMetaKey.Selector]}
		{@const upgrade = networkUpgradeTimestampSelector.$upgrade}
		<EntityView
			entityType={EntityType.NetworkUpgrade_Timestamp}
			entitySelector={networkUpgradeTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/upgrade/id/[upgradeId=stringSegment]/(networkUpgrade)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in upgrade.$network ?
								caip2StringFromValue(upgrade.$network.caip2)
							:
								upgrade.$network.slug
						),
						upgradeId: upgrade.upgradeId,
						timestampMs: String(networkUpgradeTimestampSelector.timestampMs),
						source: networkUpgradeTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{networkUpgradeTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{networkUpgradeTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{networkUpgradeTimestamp.activationHeight ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
