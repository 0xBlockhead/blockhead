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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoBlock>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	const block = $derived(selection({
			sources: [
				Source.Esplora_Rest,
				Source.Blockchair_Rest,
				Source.ThreeXpl_Rest,
				Source.BitcoinCore_JsonRpc,
				Source.LitecoinCore_JsonRpc,
				Source.DogecoinCore_JsonRpc,
			],
		},
	))
	
	
	
	
	
	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoBlock}
	entitySelector={selection.entitySelector}
	href={
		'caip2' in selection.entitySelector.$network ?
			`/network/${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}/blocks/${selection.entitySelector.height.toString()}`
		:
			`/network/${selection.entitySelector.$network.slug}/blocks/${selection.entitySelector.height.toString()}`
	}
	title={`Block #${selection.entitySelector.height.toString()}`}
	idDragPlainText={selection.entitySelector.height.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.height.toString()}
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
		<dl data-column-item="center">
			{#if 'hash' in selection.entitySelector && selection.entitySelector.hash != null}
				<div>
					<dt>Hash</dt>
					<dd>
						<TruncatedValue
							value={selection.entitySelector.hash}
							format={TruncatedValueFormat.Abbr}
						/>
					</dd>
				</div>
			{:else}
				<ResourceBoundary
					resource={block.hash}
					placeholderText="Loading block hash…"
				>
					{#snippet children(blockHash)}
						{#if blockHash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={blockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			<ResourceBoundary
				resource={block.transactionCount}
				placeholderText="Loading transaction count…"
			>
				{#snippet children(transactionCount)}
					{#if transactionCount != null}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={transactionCount} /></dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={block.timestampMs}
				placeholderText="Loading timestamp…"
			>
				{#snippet children(timestampMs)}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={timestampMs} /></dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if open}
				<ResourceBoundary
					resource={block.sizeBytes}
					placeholderText="Loading block size…"
				>
					{#snippet children(sizeBytes)}
						{#if sizeBytes != null}
						<div>
							<dt>Size</dt>
							<dd><NumberValue value={sizeBytes} /> bytes</dd>
						</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={block.weightUnits}
					placeholderText="Loading block weight…"
				>
					{#snippet children(weightUnits)}
						{#if weightUnits != null}
						<div>
							<dt>Weight</dt>
							<dd><NumberValue value={weightUnits} /> WU</dd>
						</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={block.difficulty}
					placeholderText="Loading difficulty…"
				>
					{#snippet children(difficulty)}
						{#if difficulty != null}
						<div>
							<dt>Difficulty</dt>
							<dd><NumberValue value={difficulty} /></dd>
						</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
