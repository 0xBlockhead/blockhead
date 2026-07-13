<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalSwarmAccess>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalSwarmAccess>>
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
	const globalSwarmAccess = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
	}))
	const titleFallback = $derived('global Swarm access')
	const viewDomId = $derived('-global-swarm-access-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	href={href ?? resolve('/swarm/access')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalSwarmAccess}>
			{#snippet Pending()}
				{title || 'global Swarm access'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalSwarmAccess}>
			{#snippet Pending()}
				{title || 'global Swarm access'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									scope: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const scope = pendingEntity.scope}
							{#if scope !== undefined && scope !== null}
								{String((scope) ?? '')}
							{/if}
						{/snippet}

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
		{#if detailsOpen}
			<SwarmResourcesView
				selection={selection.$$observedResources}
				title='Observed resources'
				emptyText='No Swarm resources yet.'
				id='SwarmResourcesView-observed-resources'
			/>

			<GlobalSwarmAccess_TimestampsView
				selection={selection.$$timestamps}
				title='Observations'
				emptyText='No Swarm access observations yet.'
				id='_GlobalSwarmAccess_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
