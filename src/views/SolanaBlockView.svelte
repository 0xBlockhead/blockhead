<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SolanaBlock>
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
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaBlock}
	entitySelector={selection.entitySelector}
	href={
		'slot' in selection.entitySelector ?
			(
				'slug' in selection.entitySelector.$network ?
					`/network/${selection.entitySelector.$network.slug}/blocks/${selection.entitySelector.slot.toString()}`
				:
					`/network/${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}/blocks/${selection.entitySelector.slot.toString()}`
			)
		:
			undefined
	}
	title={'slot' in selection.entitySelector ? `Slot #${selection.entitySelector.slot.toString()}` : `Slot ${selection.entitySelector.blockHash}`}
	idDragPlainText={'slot' in selection.entitySelector ? selection.entitySelector.slot.toString() : selection.entitySelector.blockHash}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			{'slot' in selection.entitySelector ? `#${selection.entitySelector.slot.toString()}` : selection.entitySelector.blockHash}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Slot </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Solana blocks are slot-indexed ledger entries produced under the SVM runtime; block height is a separate value.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ sources: [
							Source.Solana_JsonRpc,
						], fields: { blockHeight: true, blockHash: true, timestampMs: true, transactionCount: true, ...(open && ({ parentSlot: true, previousBlockHash: true })) } }),
				)}
			placeholderText="Loading Solana block…"
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if block.blockHash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={block.blockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if block.blockHeight != null}
						<div>
							<dt>Block height</dt>
							<dd>{block.blockHeight.toString()}</dd>
						</div>
					{/if}

					{#if open && block.parentSlot != null}
						<div>
							<dt>Parent slot</dt>
							<dd>{block.parentSlot.toString()}</dd>
						</div>
					{/if}

					{#if open && block.previousBlockHash != null}
						<div>
							<dt>Previous block hash</dt>
							<dd>
								<TruncatedValue
									value={block.previousBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if block.transactionCount != null}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={block.transactionCount} /></dd>
						</div>
					{/if}

					{#if block.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={block.timestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
