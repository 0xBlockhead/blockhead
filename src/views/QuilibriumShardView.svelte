<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.QuilibriumShard>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const quilibriumShard = subscribe(EntityType.QuilibriumShard,
		selector,
		({ fields: { shardKind: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.QuilibriumShard}
	entitySelector={selector}
	title={selector.shardKey}
	idDragPlainText={selector.shardKey}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={selector.shardKey}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Shard </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={quilibriumShard}
			placeholderText={`Loading Quilibrium Shard...`}
		>
			{#snippet children(quilibriumShard)}
				<dl>
					{#if quilibriumShard.fields.shardKind != null}
						<div>
							<dt>Shard Kind</dt>
							<dd>{quilibriumShard.fields.shardKind}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
