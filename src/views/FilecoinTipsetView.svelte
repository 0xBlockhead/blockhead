<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.FilecoinTipset>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinTipset}
	entitySelector={selector}
	title={`Tipset #${selector.height.toString()}`}
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
			<span>Tipset </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Filecoin tipset is a set of blocks at one height under Expected Consensus, not a single canonical block.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.FilecoinTipset, selector, ({ sources: [
					Source.Filfox_Rest,
				], fields: { timestampMs: true, $$blocks: true, ...(open && ({ $parent: true, parentWeight: true })) } }))}
			placeholderText="Loading tipset…"
		>
			{#snippet children(tipset)}
				<dl data-column-item="center">
					<div>
						<dt>Key</dt>
						<dd>{selector.tipsetKey}</dd>
					</div>

						{#if (tipset.fields.$$blocks.values.length ) > 0}
							<div>
								<dt>Blocks</dt>
								<dd><NumberValue value={tipset.fields.$$blocks.values.length } /></dd>
							</div>
						{/if}

					{#if open && tipset.fields.$parent != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<EntityView
									entityType={EntityType.FilecoinTipset}
								entitySelector={tipset.fields.$parent[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}

								/>
							</dd>
						</div>
					{/if}

					{#if open && tipset.fields.parentWeight != null}
						<div>
							<dt>Parent weight</dt>
							<dd><NumberValue value={tipset.fields.parentWeight} /></dd>
						</div>
					{/if}

					{#if tipset.fields.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={tipset.fields.timestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
