<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			entityId: EntityId<typeof schema, EntityType.SolanaBlock>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const block = useEntity(entityCollectionsContext, EntityType.SolanaBlock,
		entityId,
		({ sources: [
				Source.Solana_JsonRpc,
			], fields: { blockHeight: true, blockHash: true, timestampMs: true, transactionCount: true, ...(open && ({ parentSlot: true, previousBlockHash: true })) } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaBlock}
	{entityId}
	href={
		'slot' in entityId ?
			(
				'networkSlug' in entityId.$network ?
					`/network/${entityId.$network.networkSlug}/blocks/${entityId.slot.toString()}`
				:
					`/network/${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}/blocks/${entityId.slot.toString()}`
			)
		:
			undefined
	}
	title={'slot' in entityId ? `Slot #${entityId.slot.toString()}` : `Slot ${entityId.blockHash}`}
	idDragPlainText={'slot' in entityId ? entityId.slot.toString() : entityId.blockHash}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			{'slot' in entityId ? `#${entityId.slot.toString()}` : entityId.blockHash}
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
			resource={block}
			placeholderText="Loading Solana block…"
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if block.fields.blockHash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={block.fields.blockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if block.fields.blockHeight != null}
						<div>
							<dt>Block height</dt>
							<dd>{block.fields.blockHeight.toString()}</dd>
						</div>
					{/if}

					{#if open && block.fields.parentSlot != null}
						<div>
							<dt>Parent slot</dt>
							<dd>{block.fields.parentSlot.toString()}</dd>
						</div>
					{/if}

					{#if open && block.fields.previousBlockHash != null}
						<div>
							<dt>Previous block hash</dt>
							<dd>
								<TruncatedValue
									value={block.fields.previousBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if block.fields.transactionCount != null}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={block.fields.transactionCount} /></dd>
						</div>
					{/if}

					{#if block.fields.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={block.fields.timestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
