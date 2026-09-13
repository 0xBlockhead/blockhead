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
	}: EntityListViewProps<EntityType.MoneroKeyImage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroKeyImage}
	bind:open
	resource={
		selection({
			fields: {
				keyImage: true,
				inputIndex: true,
				$ring: true,
			},
		})
	}
>
	{#snippet Item({ item: moneroKeyImage })}
		{@const moneroKeyImageSelector = moneroKeyImage[EntityMetaKey.Selector]}
		{@const transaction = moneroKeyImageSelector.$transaction}
		<EntityView
			entityType={EntityType.MoneroKeyImage}
			entitySelector={moneroKeyImageSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/key-image/[inputIndex=nonNegativeInteger]/[keyImage=stringSegment]',
					{
						network: (
							transaction.$network.caip2 !== undefined ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.txHash,
						inputIndex: String(moneroKeyImageSelector.inputIndex),
						keyImage: moneroKeyImageSelector.keyImage,
					}
				)
			}
		>
			{#snippet Title()}
				{moneroKeyImageSelector.keyImage || 'monero key image'}
			{/snippet}

			{#snippet Value()}
				{moneroKeyImageSelector.inputIndex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moneroKeyImage.$ring == null ? '' : 'monero ring'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
