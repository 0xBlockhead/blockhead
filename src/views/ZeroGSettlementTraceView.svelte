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
			entityId: EntityId<typeof schema, EntityType.ZeroGSettlementTrace>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const zeroGSettlementTrace = useEntity(entityCollectionsContext, EntityType.ZeroGSettlementTrace,
		entityId,
		({ fields: { settlementTransactionHash: true, acknowledgementSignature: true, rewardAmount: true } }),
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
	idDragPlainText={entityId.traceId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={entityId.traceId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Settlement trace </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zeroGSettlementTrace}
			placeholderText={`Loading 0G settlement trace...`}
		>
			{#snippet children(zeroGSettlementTrace)}
				<dl>
					{#if zeroGSettlementTrace.fields.settlementTransactionHash != null}
						<div>
							<dt>Settlement Transaction Hash</dt>
							<dd>
								<TruncatedValue
									value={zeroGSettlementTrace.fields.settlementTransactionHash}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if zeroGSettlementTrace.fields.acknowledgementSignature != null}
						<div>
							<dt>Acknowledgement Signature</dt>
							<dd>
								<TruncatedValue
									value={zeroGSettlementTrace.fields.acknowledgementSignature}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if zeroGSettlementTrace.fields.rewardAmount != null}
						<div>
							<dt>Reward Amount</dt>
							<dd><NumberValue value={zeroGSettlementTrace.fields.rewardAmount} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
