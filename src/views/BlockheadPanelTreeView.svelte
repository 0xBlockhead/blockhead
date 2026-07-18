<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.BlockheadPanelTree>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadPanelTree>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const blockheadPanelTree = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'dashboard')
	const viewDomId = $derived('blockhead-panel-tree-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadPanelsView from '$/views/BlockheadPanelsView.svelte'
	import BlockheadWorkspaceView from '$/views/BlockheadWorkspaceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadPanelTree}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.id !== undefined ? resolve('/~/dashboard/[dashboardId=stringSegment]', {
			dashboardId: String(pendingEntity.id ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const id0 = pendingEntity.id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String((id0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={blockheadPanelTree}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const id0 = resolvedEntity.id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String((id0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{['Dashboard'].filter(Boolean).join(' ') || [String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadPanelTree}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{['Dashboard'].filter(Boolean).join(' ') || [String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$workspace}
			>
				{#snippet children(blockheadWorkspace)}
					{#if blockheadWorkspace != null && blockheadWorkspace[EntityMetaKey.Selector] != null}
						<div>
							<dt>workspace</dt>
							<dd>
								<BlockheadWorkspaceView
									selection={select(EntityType.BlockheadWorkspace, blockheadWorkspace[EntityMetaKey.Selector])}
									prefetched={blockheadWorkspace}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadPanelsView
				selection={
						selection.$$panels({
							count: true,
						})
					}
				title='panels'
				emptyText='No panels.'
				id='BlockheadPanelsView-panels'
			/>
		{/if}
	{/snippet}
</EntityView>
