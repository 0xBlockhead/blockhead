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
	}: EntityListViewProps<EntityType.NearContract_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearContract_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				codeHash: true,
				blockHeight: true,
			},
		})
	}
>
	{#snippet Item({ item: nearContractTimestamp })}
		{@const nearContractTimestampSelector = nearContractTimestamp[EntityMetaKey.Selector]}
		{@const contract = nearContractTimestampSelector.$contract}
		<EntityView
			entityType={EntityType.NearContract_Timestamp}
			entitySelector={nearContractTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							contract.$network.caip2 !== undefined ?
								caip2StringFromValue(contract.$network.caip2)
							:
								contract.$network.slug
						),
						address: contract.accountId,
						timestampMs: String(nearContractTimestampSelector.timestampMs),
						source: nearContractTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{nearContractTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{nearContractTimestamp.codeHash ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearContractTimestamp.blockHeight ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
