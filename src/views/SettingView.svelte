<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/~/manage'),
		title = 'Manage',
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType._Global>
			href?: string
			title?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()


	const global = $derived(selection( { sources: [
				Source.Local_Internal,
				...(
					open ?
						[Source.Dune_Rest]
					:
						[]
				),
			], fields: { ...(open ? ({ duneCreditsUsed: true, duneCreditsIncluded: true }) : ({  })) } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType._Global}
	entitySelector={selection.entitySelector}
	href={href}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{selection.entitySelector.scope}

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
		{#if open}
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
			</div>
		{/if}
	{/snippet}
</EntityView>
