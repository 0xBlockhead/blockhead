<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'


	// Props
	let {
		children,
		sourceId,
		title = 'Source',
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


	const entityId = (
		{ id: sourceId } satisfies EntityId<typeof schema, EntityType.BlockheadSource>
	)

	const sourceRow = useEntity(
		EntityType.BlockheadSource,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
		},
	)
</script>


<EntityView
	entityType={EntityType.BlockheadSource}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Source ID</dt>
				<dd>{sourceId}</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadSource}
				{entityId}
			>
				<ResourceBoundary resource={sourceRow}>
					{#snippet children(_merged)}
						<p data-text="muted">
							No additional source metadata is available yet.
						</p>
					{/snippet}
				</ResourceBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
