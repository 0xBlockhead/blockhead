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
	}: EntityListViewProps<EntityType.HederaContractAction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaContractAction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaContractAction })}
		{@const hederaContractActionSelector = hederaContractAction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.HederaContractAction}
			entitySelector={hederaContractActionSelector}
			href={
				'consensusTimestamp' in hederaContractActionSelector.$result.$transaction ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/contract-result/(hederaContractResult)/action/[callDepth=nonNegativeInteger]/[callIndex=nonNegativeInteger]',
						{
							network: (
								'caip2' in hederaContractActionSelector.$result.$transaction.$network ?
									caip2StringFromValue(hederaContractActionSelector.$result.$transaction.$network.caip2)
								:
									hederaContractActionSelector.$result.$transaction.$network.slug
							),
							consensusTimestamp: hederaContractActionSelector.$result.$transaction.consensusTimestamp,
							callDepth: String(hederaContractActionSelector.callDepth),
							callIndex: String(hederaContractActionSelector.callIndex),
						}
					)
				:
					undefined
			}
		/>
	{/snippet}
</EntitiesList>
