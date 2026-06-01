<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/~/manage'),
		title = 'Manage',
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType._Global>
			href?: string
			title?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const global = useEntity(
		EntityType._Global,
		entityId,
		{
			$: [
				Source.Local_Internal,
				...(
					open ?
						[Source.Dune_Rest]
					:
						[]
				),
			],
			...(open ?
				{
					duneCreditsUsed: {},
					duneCreditsIncluded: {},
				}
			:
				{}),
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
</script>


<EntityView
	entityType={EntityType._Global}
	{entityId}
	href={href}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{entityId.scope}

	{/snippet}

	{#snippet Title()}
		{title}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Browser storage can keep UI preferences and optional third-party API usage counters tied to one profile.
		</p>
		<p>
			RPC or indexer base URLs and API keys belong in transport configuration globals, not in generic preference blobs.
		</p>
	{/snippet}

	{#snippet Content({})}
		{#if summaryOpen}
		<dl data-column-item="center">
			<ResourceBoundary resource={global}>
				{#snippet children(global)}
					{#if global.duneCreditsUsed !== undefined}
						<div>
							<dt>Dune credits used</dt>
							<dd>{String(global.duneCreditsUsed)}</dd>
						</div>
					{/if}

					{#if global.duneCreditsIncluded !== undefined}
						<div>
							<dt>Dune credits included</dt>
							<dd>{String(global.duneCreditsIncluded)}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
		{/if}
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if _open}
			<div>
				<CollapsibleTabs sections={[]}>
					<ResourceBoundary resource={global}>
						{#snippet children(global)}
							<div>
								{#if global.duneCreditsIncluded !== undefined}
									<p><strong>Dune credits included:</strong> {String(global.duneCreditsIncluded)}</p>
								{/if}

								{#if (
									global.duneCreditsUsed === undefined
									&& global.duneCreditsIncluded === undefined
								)}
									<p data-text="muted">
										No usage totals global yet.
									</p>
								{/if}
							</div>
						{/snippet}
					</ResourceBoundary>
				</CollapsibleTabs>
			</div>
		{/if}
	{/snippet}
</EntityView>
