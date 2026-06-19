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
			selection: EntityProxyResource<typeof schema, EntityType.MoneroBlock>
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
	entityType={EntityType.MoneroBlock}
	entitySelector={selection.entitySelector}
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
			Monero blocks reveal public transaction structure, but not transparent sender, recipient, or account balances.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						], fields: { hash: true, timestampMs: true, $$transactions: true, ...(open && ({ difficulty: true, weightBytes: true })) } }),
				)}
			placeholderText="Loading Monero block…"
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if ('hash' in selection.entitySelector && selection.entitySelector.hash != null) || block.fields.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={'hash' in selection.entitySelector ? selection.entitySelector.hash : block.fields.hash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

						{#if (block.fields.$$transactions.values.length ) > 0}
							<div>
								<dt>Transactions</dt>
								<dd><NumberValue value={block.fields.$$transactions.values.length } /></dd>
							</div>
						{/if}

					{#if block.fields.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={block.fields.timestampMs} /></dd>
						</div>
					{/if}

					{#if open && block.fields.weightBytes != null}
						<div>
							<dt>Weight</dt>
							<dd><NumberValue value={block.fields.weightBytes} /> bytes</dd>
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
