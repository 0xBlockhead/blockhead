<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ZeroGDaQuorum>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const daQuorum = useEntity(
		EntityType.ZeroGDaQuorum,
		entityId,
		{
			selectionMethod: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDaQuorum}
	{entityId}
	title={entityId.quorumId}
	bind:open
	{...EntityViewProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			A 0G DA quorum is a selected group of DA nodes responsible for availability attestations for data blobs.
		</p>
	{/snippet}

	{#snippet Title()}
		{entityId.quorumId}
	{/snippet}

	{#snippet Heading()}
		{entityId.quorumId}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={daQuorum}
			placeholderText="Loading 0G DA quorum…"
		>
			{#snippet children(daQuorum)}
				{#if daQuorum.selectionMethod != null}
					<dl>
						<div>
							<dt>Selection</dt>
							<dd>{daQuorum.selectionMethod}</dd>
						</div>
					</dl>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
