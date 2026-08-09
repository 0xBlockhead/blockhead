<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadCashuProof> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuProof}
	bind:open
	resource={
		selection({
			...{
				fields: {
					secretHash: true,
					amount: true,
					unit: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadCashuProof })}
		{@const blockheadCashuProofSelector = blockheadCashuProof[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadCashuProof}
			entitySelector={blockheadCashuProofSelector}
			href={
				resolve(
					'/~/cashu/wallet/[walletId=stringSegment]/mint/[mintUrl=stringSegment]/keyset/[keysetId=stringSegment]/proof/[secretHash=stringSegment]',
					{
						walletId: blockheadCashuProofSelector.walletId,
						mintUrl: blockheadCashuProofSelector.mintUrl,
						keysetId: blockheadCashuProofSelector.keysetId,
						secretHash: blockheadCashuProofSelector.secretHash,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadCashuProofSelector.secretHash || 'blockhead Cashu proof'}
			{/snippet}

			{#snippet Value()}
				{blockheadCashuProof.amount + blockheadCashuProof.unit}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
