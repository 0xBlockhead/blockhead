<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalSwarmAccess> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'global Swarm access'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SwarmResourcesView from '$/views/SwarmResourcesView.svelte'
	import GlobalSwarmAccess_TimestampsView from '$/views/_GlobalSwarmAccess_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalSwarmAccess}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={href ?? resolve('/(swarm)/swarm/(swarmProtocol)/access')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		global Swarm access
	{/snippet}

	{#snippet Value()}
		{titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					{pendingEntity.scope}
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
						id='observed-resources'
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
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
