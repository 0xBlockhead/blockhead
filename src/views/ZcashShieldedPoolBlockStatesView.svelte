<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		})
	}
>
	{#snippet Item({ item: zcashShieldedPoolBlockState })}
		{@const zcashShieldedPoolBlockStateSelector = zcashShieldedPoolBlockState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZcashShieldedPoolBlockState}
			entitySelector={zcashShieldedPoolBlockStateSelector}
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
