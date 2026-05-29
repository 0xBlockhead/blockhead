<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		sourceId,
		href = resolve(
			'/~/(manage)/manage/(sources)/source/[sourceId]',
			{ sourceId },
		),
		title = 'Resolver source',
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			sourceId: string
			href?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// Functions
	const entityId = (
		{ id: sourceId } satisfies EntityId<typeof schema, EntityType.BlockheadSource>
	)


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const source = useEntity(
		EntityType.BlockheadSource,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSource}
	{entityId}
	href={href}
	{title}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		{title}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Configured HTTP or GraphQL transport for chain or market APIs: base URL plus stable id for repeat requests.
		</p>
		<p>
			This is an application-layer data endpoint, not a browser wallet identity or an ephemeral debug session.
		</p>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
	{/snippet}
</EntityView>
