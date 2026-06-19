<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGDaQuorum>
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
</script>


<EntityView
	entityType={EntityType.ZeroGDaQuorum}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.quorumId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{selection.entitySelector.quorumId}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A 0G DA quorum is a selected group of DA nodes responsible for availability attestations for data blobs.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { selectionMethod: true } })}
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
