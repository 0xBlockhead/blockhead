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
	}: EntityListViewProps<EntityType.HederaContractLog> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaContractLog}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaContractLog })}
		{@const hederaContractLogSelector = hederaContractLog[EntityMetaKey.Selector]}
		{@const contract = hederaContractLogSelector.$contract}
		<EntityView
			entityType={EntityType.HederaContractLog}
			entitySelector={hederaContractLogSelector}
			href={
				hederaContractLogSelector.$result !== undefined
				&& hederaContractLogSelector.$result.$transaction.consensusTimestamp !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/contract-result/(hederaContractResult)/log/[logIndex=nonNegativeInteger]',
						{
							network: (
								hederaContractLogSelector.$result.$transaction.$network.caip2 !== undefined ?
									caip2StringFromValue(hederaContractLogSelector.$result.$transaction.$network.caip2)
								:
									hederaContractLogSelector.$result.$transaction.$network.slug
							),
							consensusTimestamp: hederaContractLogSelector.$result.$transaction.consensusTimestamp,
							logIndex: String(hederaContractLogSelector.logIndex),
						}
					)
				:
					hederaContractLogSelector.consensusTimestamp !== undefined
					&& contract !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/consensus-log/[consensusTimestamp=stringSegment]/[logIndex=nonNegativeInteger]',
							{
								network: (
									contract.$network.caip2 !== undefined ?
										caip2StringFromValue(contract.$network.caip2)
									:
										contract.$network.slug
								),
								address: contract.contractId,
								consensusTimestamp: hederaContractLogSelector.consensusTimestamp,
								logIndex: String(hederaContractLogSelector.logIndex),
							}
						)
					:
						undefined
			}
		/>
	{/snippet}
</EntitiesList>
