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
			selection: EntityProxyResource<typeof schema, EntityType.LogosZone>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.LogosZone}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.zoneId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{selection.entitySelector.zoneId}
	{/snippet}


	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { sources: [
					Source.LogosDocs_Rest,
				], fields: { zoneKind: true } })}
			placeholderText="Loading Logos zone…"
		>
			{#snippet children(zone)}
				<dl>
					{#if zone.zoneKind != null}
						<div>
							<dt>Kind</dt>
							<dd>{zone.zoneKind}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView2>
