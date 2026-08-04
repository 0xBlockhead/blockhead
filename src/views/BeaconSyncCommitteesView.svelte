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
		title = 'Sync committees',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconSyncCommittee> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconSyncCommittee}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				period: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: beaconSyncCommittee })}
		{@const beaconSyncCommitteeSelector = beaconSyncCommittee[EntityMetaKey.Selector]}
		{@const network = beaconSyncCommitteeSelector.$network}
		<EntityView
			entityType={EntityType.BeaconSyncCommittee}
			entitySelector={beaconSyncCommitteeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sync-committee/[period=nonNegativeInteger]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						period: String(beaconSyncCommitteeSelector.period),
					}
				)
			}
		>
			{#snippet Title()}
				{`Sync committee #${beaconSyncCommitteeSelector.period}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{beaconSyncCommittee.$network.name || (beaconSyncCommittee.$network.caip2 == null ? '' : `${beaconSyncCommittee.$network.caip2.namespace}:${beaconSyncCommittee.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
