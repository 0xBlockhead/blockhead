<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { subscribe } from '$/routes/+layout.svelte'

	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.TronBlock>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const block = subscribe(EntityType.TronBlock, selector, ({ fields: { hash: true, timestampMs: true, transactionCount: true, ...(open && ({ parentHash: true, $witness: true, txTrieRoot: true, version: true })) } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import TronWitnessView from '$/views/TronWitnessView.svelte'
</script>


<EntityView
	entityType={EntityType.TronBlock}
	entitySelector={selector}
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
		<p>TRON blocks are DPoS-produced ledger blocks; TVM execution is modeled separately as the network execution environment.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={block}
			placeholderText="Loading TRON block..."
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if block.fields.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={block.fields.hash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && block.fields.parentHash != null}
						<div>
							<dt>Parent hash</dt>
							<dd>
								<TruncatedValue
									value={block.fields.parentHash}
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

					{#if open && block.fields.$witness != null}
						<div>
							<dt>Witness</dt>
							<dd>
								<TronWitnessView
									selector={block.fields.$witness[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if open && block.fields.version != null}
						<div>
							<dt>Version</dt>
							<dd><NumberValue value={block.fields.version} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
