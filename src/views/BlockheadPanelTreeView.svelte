<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/~/(dashboards)/dashboard/[dashboardId]',
			{
				dashboardId: selector.id,
			},
		),
		title = 'Panel tree',
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BlockheadPanelTree>
			href?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const panelTree = subscribe(EntityType.BlockheadPanelTree,
		selector,
		{
			sources: [
				Source.Local_Internal,
			],
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadPanelTree}
	entitySelector={selector}
	href={href}
	{title}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.id}
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

	{#snippet Content({})}
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
		<section
			data-card
			data-column="gap-2"
			id={`${stringify(selector)}:metadata`}
		>
			<ResourceBoundary resource={panelTree}>
				{#snippet children(panelTree)}
					<p data-text="muted">
						No saved panel layout metadata yet.
					</p>
				{/snippet}
			</ResourceBoundary>
		</section>

	{/snippet}
</EntityView>
