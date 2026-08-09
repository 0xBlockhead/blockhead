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
	}: EntityListViewProps<EntityType.CardanoCertificate> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoCertificate}
	bind:open
	resource={
		selection({
			...{
				fields: {
					certificateKind: true,
					certificateIndex: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: cardanoCertificate })}
		{@const cardanoCertificateSelector = cardanoCertificate[EntityMetaKey.Selector]}
		{@const transaction = cardanoCertificateSelector.$transaction}
		<EntityView
			entityType={EntityType.CardanoCertificate}
			entitySelector={cardanoCertificateSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/certificate/[certificateIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.hash,
						certificateIndex: String(cardanoCertificateSelector.certificateIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{[cardanoCertificate.certificateKind, 'Certificate #' + String(cardanoCertificateSelector.certificateIndex)].filter(Boolean).join(' ') || 'Cardano certificate'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
