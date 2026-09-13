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
	}: EntityListViewProps<EntityType.TezosAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosAccount_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosAccountTimestamp })}
		{@const tezosAccountTimestampSelector = tezosAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = tezosAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.TezosAccount_Timestamp}
			entitySelector={tezosAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							account.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(account.$network.$network.caip2)
							:
								account.$network.$network.slug
						),
						address: account.address,
						level: String(tezosAccountTimestampSelector.level),
						source: tezosAccountTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
