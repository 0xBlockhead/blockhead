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
	}: EntityListViewProps<EntityType.ZcashShieldedPoolBlockState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZcashShieldedPoolBlockState}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$pool: {
						fields: {
							noteProtocol: true,
							activationNetworkUpgrade: true,
						},
					},
					saplingTree: true,
					orchardTree: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: zcashShieldedPoolBlockState })}
		{@const zcashShieldedPoolBlockStateSelector = zcashShieldedPoolBlockState[EntityMetaKey.Selector]}
		{@const block = zcashShieldedPoolBlockStateSelector.$block}
		<EntityView
			entityType={EntityType.ZcashShieldedPoolBlockState}
			entitySelector={zcashShieldedPoolBlockStateSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/shielded-pool/[pool=stringSegment]',
					{
						network: (
							'caip2' in block.$network ?
								caip2StringFromValue(block.$network.caip2)
							:
								block.$network.slug
						),
						blockNumber: String(block.height),
						pool: zcashShieldedPoolBlockStateSelector.$pool.pool,
					}
				)
			}
		>
			{#snippet Title()}
				{zcashShieldedPoolBlockStateSelector.$pool.pool || 'Zcash shielded pool'}
			{/snippet}

			{#snippet Value()}
				{[zcashShieldedPoolBlockState.saplingTree == null ? '' : `${zcashShieldedPoolBlockState.saplingTree.finalRoot} / ${zcashShieldedPoolBlockState.saplingTree.finalState}`, zcashShieldedPoolBlockState.orchardTree == null ? '' : `${zcashShieldedPoolBlockState.orchardTree.finalRoot} / ${zcashShieldedPoolBlockState.orchardTree.finalState}`].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
