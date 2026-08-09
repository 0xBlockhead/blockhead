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
	}: EntityListViewProps<EntityType.MoneroRingMember> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroRingMember}
	bind:open
	resource={
		selection({
			...{
				fields: {
					memberIndex: true,
					globalOutputIndex: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: moneroRingMember })}
		{@const moneroRingMemberSelector = moneroRingMember[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MoneroRingMember}
			entitySelector={moneroRingMemberSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/key-image/[inputIndex=nonNegativeInteger]/[keyImage=stringSegment]/(moneroKeyImage)/ring/(moneroRing)/member/[memberIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in moneroRingMemberSelector.$ring.$keyImage.$transaction.$network ?
								caip2StringFromValue(moneroRingMemberSelector.$ring.$keyImage.$transaction.$network.caip2)
							:
								moneroRingMemberSelector.$ring.$keyImage.$transaction.$network.slug
						),
						transactionId: moneroRingMemberSelector.$ring.$keyImage.$transaction.txHash,
						inputIndex: String(moneroRingMemberSelector.$ring.$keyImage.inputIndex),
						keyImage: moneroRingMemberSelector.$ring.$keyImage.keyImage,
						memberIndex: String(moneroRingMemberSelector.memberIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{moneroRingMemberSelector.memberIndex}
			{/snippet}

			{#snippet Value()}
				{moneroRingMember.globalOutputIndex ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
