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
	}: EntityListViewProps<EntityType.ZcashShieldedAction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZcashShieldedAction}
	bind:open
	resource={
		selection({
			fields: {
				actionKind: true,
				indexInTransaction: true,
				pool: true,
				nullifier: true,
				noteCommitment: true,
			},
		})
	}
>
	{#snippet Item({ item: zcashShieldedAction })}
		{@const zcashShieldedActionSelector = zcashShieldedAction[EntityMetaKey.Selector]}
		{@const transaction = zcashShieldedActionSelector.$transaction}
		<EntityView
			entityType={EntityType.ZcashShieldedAction}
			entitySelector={zcashShieldedActionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]',
					{
						network: (
							transaction.$network.caip2 !== undefined ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.txId,
						pool: zcashShieldedActionSelector.pool,
						actionKind: zcashShieldedActionSelector.actionKind,
						actionIndex: String(zcashShieldedActionSelector.indexInTransaction),
					}
				)
			}
		>
			{#snippet Title()}
				{[zcashShieldedActionSelector.actionKind, String(zcashShieldedActionSelector.indexInTransaction)].filter(Boolean).join(' ') || 'Zcash shielded action'}
			{/snippet}

			{#snippet Value()}
				{zcashShieldedActionSelector.pool}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(zcashShieldedAction.nullifier ?? ''), (zcashShieldedAction.noteCommitment ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
