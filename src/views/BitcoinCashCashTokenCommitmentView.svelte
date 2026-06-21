<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BitcoinCashCashTokenCommitment>
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenCommitment}
	entitySelector={selection.entitySelector}
	title={'Bitcoin Cash CashToken Commitment'}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Bitcoin Cash CashToken Commitment
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { commitmentHex: true } })}
			placeholderText={`Loading Bitcoin Cash CashToken Commitment...`}
		>
			{#snippet children(bitcoinCashCashTokenCommitment)}
				<dl>
					{#if bitcoinCashCashTokenCommitment.commitmentHex != null}
						<div>
							<dt>Commitment Hex</dt>
							<dd>
								<TruncatedValue
									value={bitcoinCashCashTokenCommitment.commitmentHex}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
