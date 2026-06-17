<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BitcoinCashCashTokenNft>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenNft}
	entitySelector={selector}
	title={'Bitcoin Cash CashToken NFT'}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Bitcoin Cash CashToken NFT
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.BitcoinCashCashTokenNft,
					selector,
					({ fields: { capability: true } }),
				)}
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
