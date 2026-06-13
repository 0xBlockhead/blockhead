<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LogosZone>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const zone = subscribe(EntityType.LogosZone,
		entityId,
		({ sources: [
				Source.LogosDocs_Rest,
			], fields: { zoneKind: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.LogosZone}
	{entityId}
	title={entityId.zoneId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{entityId.zoneId}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Logos zones model documented components of the Logos stack, including the Logos Chain, DVCI, Network Gatekeeper, and W3bI.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zone}
			placeholderText="Loading Logos zone…"
		>
			{#snippet children(zone)}
				<dl>
					{#if zone.fields.zoneKind != null}
						<div>
							<dt>Kind</dt>
							<dd>{zone.fields.zoneKind}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
