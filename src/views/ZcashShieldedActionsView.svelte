<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'
	import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'


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
		<EntityView
			entityType={EntityType.ZcashShieldedAction}
			entitySelector={zcashShieldedActionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in zcashShieldedActionSelector.$transaction.$network ?
								String(caip2StringFromValue(zcashShieldedActionSelector.$transaction.$network.caip2))
							:
								String(zcashShieldedActionSelector.$transaction.$network.slug)
						),
						transactionId: String(zcashShieldedActionSelector.$transaction.txId),
						pool: String(zcashShieldedActionSelector.pool),
						actionKind: String(zcashShieldedActionSelector.actionKind),
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
