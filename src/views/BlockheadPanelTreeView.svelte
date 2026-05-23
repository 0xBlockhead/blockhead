<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { stringify } from 'devalue'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		children,
		entityId,
		title = 'Panel tree',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadPanelTree>
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

	const panelTree = useEntity(
		EntityType.BlockheadPanelTree,
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
	entityType={EntityType.BlockheadPanelTree}
	{entityId}
	{title}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Value()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}

		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Serialized layout graphs capture nested region ids and split ratios so multi-pane dashboards can restore geometry across reloads.
		</p>
		<p>
			Chat logs, automation replays, and chain head cursors are unrelated artifacts—layout trees only describe viewport structure.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Layout kind</dt>
				<dd>
					Dashboard workspace tree.
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BlockheadPanelTree}
			{entityId}
		/>

		<div
			class="blockhead-panel-tree-carousel-groups"
			data-column="gap-3"
		>
			<section
				{...{ 'data-card': '' }}
				data-column="gap-2"
				id={`${stringify(entityId)}:metadata`}
			>
				<ResourceBoundary resource={panelTree}>
					{#snippet children(panelTree)}
						<p data-text="muted">
							No saved panel layout metadata yet.
						</p>
					{/snippet}
				</ResourceBoundary>
			</section>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
