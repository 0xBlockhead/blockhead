<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BitcoinCashCashTokenNft>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const bitcoinCashCashTokenNft = useEntity(entityCollectionsContext, 
		EntityType.BitcoinCashCashTokenNft,
		entityId,
		({ fields: { capability: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenNft}
	{entityId}
	title={'Bitcoin Cash CashToken NFT'}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Bitcoin Cash CashToken NFT
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={bitcoinCashCashTokenNft}
			placeholderText={`Loading Bitcoin Cash CashToken NFT...`}
		>
			{#snippet children(bitcoinCashCashTokenNft)}
				<dl>
					{#if bitcoinCashCashTokenNft.fields.capability != null}
						<div>
							<dt>Capability</dt>
							<dd>{bitcoinCashCashTokenNft.fields.capability}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
