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
	}: EntityListViewProps<EntityType.TonTransactionPhase> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonTransactionPhase}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonTransactionPhase })}
		{@const tonTransactionPhaseSelector = tonTransactionPhase[EntityMetaKey.Selector]}
		{@const transaction = tonTransactionPhaseSelector.$transaction}
		<EntityView
			entityType={EntityType.TonTransactionPhase}
			entitySelector={tonTransactionPhaseSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]/(tonTransaction)/phase/[phaseKind=stringSegment]',
					{
						network: (
							'caip2' in transaction.$account.$network ?
								caip2StringFromValue(transaction.$account.$network.caip2)
							:
								transaction.$account.$network.slug
						),
						accountId: transaction.$account.address,
						lt: String(transaction.lt),
						phaseKind: tonTransactionPhaseSelector.phaseKind,
					}
				)
			}
		>
			{#snippet Title()}
				TON transaction phase
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
