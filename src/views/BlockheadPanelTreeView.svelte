<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/~/(manage)/manage/(profiles)/profile/[profileId]/panel-tree/[panelTreeId]',
			{
				profileId: entityId.profileId,
				panelTreeId: entityId.panelTreeId,
			},
		),
		title = 'Panel tree',
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BlockheadPanelTree>
			href?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
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
					{#snippet children(loadedPanelTree)}
						<p data-text="muted">
							No saved panel layout metadata yet.
						</p>
					{/snippet}
				</ResourceBoundary>
			</section>
		</div>

	{/snippet}
</EntityView>
