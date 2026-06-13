<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.QuilibriumFrame>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const quilibriumFrame = subscribe(EntityType.QuilibriumFrame,
		entityId,
		({ fields: { frameHash: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.QuilibriumFrame}
	{entityId}
	title={entityId.shardKey}
	idDragPlainText={entityId.shardKey}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={entityId.shardKey}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Frame </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={quilibriumFrame}
			placeholderText={`Loading Quilibrium Frame...`}
		>
			{#snippet children(quilibriumFrame)}
				<dl>
					{#if quilibriumFrame.fields.frameHash != null}
						<div>
							<dt>Frame Hash</dt>
							<dd>
								<TruncatedValue
									value={quilibriumFrame.fields.frameHash}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
