<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const globalSwarmAccess = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			...(open && {
				$$sourceWindowResources: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived('global Swarm access')
	const viewDomId = $derived('-global-swarm-access-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SwarmResourcesView from '$/views/SwarmResourcesView.svelte'
	import GlobalSwarmAccess_TimestampsView from '$/views/_GlobalSwarmAccess_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalSwarmAccess}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{title || 'global Swarm access'}
		{:else}
			<ResourceBoundary resource={globalSwarmAccess}>
				{#snippet Pending()}
					{title || 'global Swarm access'}
				{/snippet}

				{#snippet children(entity)}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{title || 'global Swarm access'}
		{:else}
			<ResourceBoundary resource={globalSwarmAccess}>
				{#snippet Pending()}
					{title || 'global Swarm access'}
				{/snippet}

				{#snippet children(entity)}
					{titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<SwarmResourcesView
				selection={selection[EntityProxyField]<EntityType.SwarmResource>('$$sourceWindowResources')}
				title='Source window resources'
				emptyText='No Swarm resources yet.'
				id='SwarmResourcesView-$$sourceWindowResources'
			/>

			<GlobalSwarmAccess_TimestampsView
				selection={selection[EntityProxyField]<EntityType._GlobalSwarmAccess_Timestamp>('$$timestamps')}
				title='Observations'
				emptyText='No Swarm access observations yet.'
				id='_GlobalSwarmAccess_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
