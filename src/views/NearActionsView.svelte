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
	}: EntityListViewProps<EntityType.NearAction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearAction}
	bind:open
	resource={
		selection({
			fields: {
				actionKind: true,
				methodName: true,
				actionIndex: true,
			},
		})
	}
>
	{#snippet Item({ item: nearAction })}
		{@const nearActionSelector = nearAction[EntityMetaKey.Selector]}
		{@const transaction = nearActionSelector.$transaction}
		<EntityView
			entityType={EntityType.NearAction}
			entitySelector={nearActionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/action/[actionIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.hash,
						actionIndex: String(nearActionSelector.actionIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{nearAction.actionKind || 'near action'}
			{/snippet}

			{#snippet Value()}
				{nearAction.methodName ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearActionSelector.actionIndex}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
