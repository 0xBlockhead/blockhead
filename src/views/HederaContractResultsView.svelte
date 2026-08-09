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
	}: EntityListViewProps<EntityType.HederaContractResult> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaContractResult}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaContractResult })}
		{@const hederaContractResultSelector = hederaContractResult[EntityMetaKey.Selector]}
		{@const transaction = hederaContractResultSelector.$transaction}
		<EntityView
			entityType={EntityType.HederaContractResult}
			entitySelector={hederaContractResultSelector}
			href={
				'consensusTimestamp' in transaction ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/contract-result',
						{
							network: (
								'caip2' in transaction.$network ?
									caip2StringFromValue(transaction.$network.caip2)
								:
									transaction.$network.slug
							),
							consensusTimestamp: transaction.consensusTimestamp,
						}
					)
				:
					undefined
			}
		/>
	{/snippet}
</EntitiesList>
