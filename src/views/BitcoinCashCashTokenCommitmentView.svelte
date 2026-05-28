<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BitcoinCashCashTokenCommitment>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const bitcoinCashCashTokenCommitment = useEntity(
		EntityType.BitcoinCashCashTokenCommitment,
		entityId,
		{
			commitmentHex: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenCommitment}
	{entityId}
	title={'Bitcoin Cash CashToken Commitment'}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		Bitcoin Cash CashToken Commitment
	{/snippet}

	{#snippet Heading()}
		Bitcoin Cash CashToken Commitment
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={bitcoinCashCashTokenCommitment}
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
