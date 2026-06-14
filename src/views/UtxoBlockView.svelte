<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.UtxoBlock>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const block = subscribe(EntityType.UtxoBlock,
		selector,
		({ sources: [
				Source.Esplora_Rest,
				Source.Blockchair_Rest,
				Source.ThreeXpl_Rest,
				Source.BitcoinCore_JsonRpc,
				Source.LitecoinCore_JsonRpc,
				Source.DogecoinCore_JsonRpc,
			], fields: { hash: true, transactionCount: true, timestampMs: true, ...(open && ({ sizeBytes: true, weightUnits: true, difficulty: true })) } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoBlock}
	entitySelector={selector}
	href={
		'networkSlug' in selector.$network ?
			`/network/${selector.$network.networkSlug}/blocks/${selector.height.toString()}`
		:
			`/network/${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}/blocks/${selector.height.toString()}`
	}
	title={`Block #${selector.height.toString()}`}
	idDragPlainText={selector.height.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selector.height.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Block </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A UTXO block commits an ordered set of transactions and a parent header; account state is not a native primitive.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={block}
			placeholderText="Loading block…"
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if selector.hash != null || block.fields.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={selector.hash ?? block.fields.hash}
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

					{#if open && block.fields.sizeBytes != null}
						<div>
							<dt>Size</dt>
							<dd><NumberValue value={block.fields.sizeBytes} /> bytes</dd>
						</div>
					{/if}

					{#if open && block.fields.weightUnits != null}
						<div>
							<dt>Weight</dt>
							<dd><NumberValue value={block.fields.weightUnits} /> WU</dd>
						</div>
					{/if}

					{#if open && block.fields.difficulty != null}
						<div>
							<dt>Difficulty</dt>
							<dd><NumberValue value={block.fields.difficulty} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
