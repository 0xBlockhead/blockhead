<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType._GlobalSwarmAccess>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType._GlobalSwarmAccess>
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
	const globalSwarmAccess = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'global Swarm access'
	const viewDomId = $derived('-global-swarm-access-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SwarmResourcesView from '$/views/SwarmResourcesView.svelte'
	import GlobalSwarmAccess_TimestampsView from '$/views/_GlobalSwarmAccess_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalSwarmAccess}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector.scope === '_GlobalSwarmAccess' ?
				resolve('/swarm/access')
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={globalSwarmAccess}>
				{#snippet children(entity)}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails}
			{titleFallback}
		{:else}
			<ResourceBoundary resource={globalSwarmAccess}>
				{#snippet children(entity)}
					{titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									scope: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const scope = resolvedEntity.scope}
							{#if scope !== undefined && scope !== null}
								{String((scope) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const globalSwarmAccessSwarmResourcesViewObservedResourcesResource = selection.$$observedResources}
		<ResourceBoundary
			resource={globalSwarmAccessSwarmResourcesViewObservedResourcesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<SwarmResourcesView
					selection={globalSwarmAccessSwarmResourcesViewObservedResourcesResource}
					countResource={globalSwarmAccessSwarmResourcesViewObservedResourcesResource.count}
					title='Observed resources'
					id='SwarmResourcesView-observed-resources'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const globalSwarmAccessGlobalSwarmAccessTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={globalSwarmAccessGlobalSwarmAccessTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<GlobalSwarmAccess_TimestampsView
					selection={globalSwarmAccessGlobalSwarmAccessTimestampsViewTimestampsResource}
					countResource={globalSwarmAccessGlobalSwarmAccessTimestampsViewTimestampsResource.count}
					title='Observations'
					id='_GlobalSwarmAccess_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
