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
	}: EntityListViewProps<EntityType.MoneroRing> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroRing}
	bind:open
	resource={
		selection({
			fields: {
				$keyImage: true,
			},
		})
	}
>
	{#snippet Item({ item: moneroRing })}
		{@const moneroRingSelector = moneroRing[EntityMetaKey.Selector]}
		{@const keyImage = moneroRingSelector.$keyImage}
		<EntityView
			entityType={EntityType.MoneroRing}
			entitySelector={moneroRingSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/key-image/[inputIndex=nonNegativeInteger]/[keyImage=stringSegment]/(moneroKeyImage)/ring',
					{
						network: (
							'caip2' in keyImage.$transaction.$network ?
								caip2StringFromValue(keyImage.$transaction.$network.caip2)
							:
								keyImage.$transaction.$network.slug
						),
						transactionId: keyImage.$transaction.txHash,
						inputIndex: String(keyImage.inputIndex),
						keyImage: keyImage.keyImage,
					}
				)
			}
		>
			{#snippet Title()}
				{moneroRingSelector.$keyImage.keyImage || 'monero key image'}
			{/snippet}

			{#snippet Value()}
				Ring
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
