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
			entityId: EntityId<typeof schema, EntityType.ZeroGSettlementTrace>
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

	const zeroGSettlementTrace = useEntity(
		EntityType.ZeroGSettlementTrace,
		entityId,
		{
			settlementTransactionHash: {},
			acknowledgementSignature: {},
			rewardAmount: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGSettlementTrace}
	{entityId}
	title={entityId.traceId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.traceId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zeroGSettlementTrace}
			placeholderText={`Loading 0G settlement trace...`}
		>
			{#snippet children(zeroGSettlementTrace)}
				<dl>
					{#if zeroGSettlementTrace.settlementTransactionHash != null}
						<div>
							<dt>Settlement Transaction Hash</dt>
							<dd>
								<TruncatedValue
									value={zeroGSettlementTrace.settlementTransactionHash}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if zeroGSettlementTrace.acknowledgementSignature != null}
						<div>
							<dt>Acknowledgement Signature</dt>
							<dd>
								<TruncatedValue
									value={zeroGSettlementTrace.acknowledgementSignature}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if zeroGSettlementTrace.rewardAmount != null}
						<div>
							<dt>Reward Amount</dt>
							<dd><NumberValue value={zeroGSettlementTrace.rewardAmount} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
