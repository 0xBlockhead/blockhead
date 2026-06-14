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
			selector: EntitySelector<typeof schema, EntityType.ZeroGDaQuorum>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const daQuorum = subscribe(EntityType.ZeroGDaQuorum,
		selector,
		({ fields: { selectionMethod: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDaQuorum}
	entitySelector={selector}
	title={selector.quorumId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{selector.quorumId}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A 0G DA quorum is a selected group of DA nodes responsible for availability attestations for data blobs.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={daQuorum}
			placeholderText="Loading 0G DA quorum…"
		>
			{#snippet children(daQuorum)}
				{#if daQuorum.fields.selectionMethod != null}
					<dl>
						<div>
							<dt>Selection</dt>
							<dd>{daQuorum.fields.selectionMethod}</dd>
						</div>
					</dl>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
