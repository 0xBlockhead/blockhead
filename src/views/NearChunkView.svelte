<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.NearChunk>
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
	entityType={EntityType.NearChunk}
	entitySelector={selector}
	title={selector.chunkHash}
	idDragPlainText={selector.chunkHash}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={selector.chunkHash}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Chunk </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.NearChunk, selector, ({ fields: { shardId: true, gasUsed: true } }))}
			placeholderText={`Loading NEAR Chunk...`}
		>
			{#snippet children(nearChunk)}
				<dl>
					{#if nearChunk.fields.shardId != null}
						<div>
							<dt>Shard ID</dt>
							<dd><NumberValue value={nearChunk.fields.shardId} /></dd>
						</div>
					{/if}

					{#if nearChunk.fields.gasUsed != null}
						<div>
							<dt>Gas Used</dt>
							<dd><NumberValue value={nearChunk.fields.gasUsed} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
