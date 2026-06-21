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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGSettlementTrace>
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
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGSettlementTrace}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.traceId}
	idDragPlainText={selection.entitySelector.traceId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={selection.entitySelector.traceId}
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
			resource={selection( { fields: { settlementTransactionHash: true, acknowledgementSignature: true, rewardAmount: true } })}
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
