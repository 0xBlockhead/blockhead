<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		children,
		sourceId,
		title = 'Resolver source',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			sourceId: string
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const entityId = (
		{ id: sourceId } satisfies EntityId<typeof schema, EntityType.BlockheadSource>
	)

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
	{title}
	bind:open
	{href}
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Title()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={source}
			placeholderText="Loading source…"
		>
			{#snippet children(source)}
				{@render Title()}
			{/snippet}
		</ResourceBoundary>
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
		<EntityDetails
			entityType={EntityType.BlockheadSource}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
