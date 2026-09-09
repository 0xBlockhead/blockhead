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
		id = 'DogecoinAuxPowMerkleBranches-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DogecoinAuxPowMerkleBranch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DogecoinAuxPowMerkleBranch}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				branchKind: true,
				$auxPow: true,
			},
		})
	}
>
	{#snippet Item({ item: dogecoinAuxPowMerkleBranch })}
		{@const dogecoinAuxPowMerkleBranchSelector = dogecoinAuxPowMerkleBranch[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DogecoinAuxPowMerkleBranch}
			entitySelector={dogecoinAuxPowMerkleBranchSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/aux-pow/(dogecoinBlockAuxPow)/branch/[branchKind=stringSegment]',
					{
						network: (
							'caip2' in dogecoinAuxPowMerkleBranchSelector.$auxPow.$block.$network ?
								caip2StringFromValue(dogecoinAuxPowMerkleBranchSelector.$auxPow.$block.$network.caip2)
							:
								dogecoinAuxPowMerkleBranchSelector.$auxPow.$block.$network.slug
						),
						blockNumber: String(dogecoinAuxPowMerkleBranchSelector.$auxPow.$block.height),
						branchKind: dogecoinAuxPowMerkleBranchSelector.branchKind,
					}
				)
			}
		>
			{#snippet Title()}
				{dogecoinAuxPowMerkleBranchSelector.branchKind || 'dogecoin aux pow merkle branch'}
			{/snippet}

			{#snippet Value()}
				{`Block #${dogecoinAuxPowMerkleBranchSelector.$auxPow.$block.height}`}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
