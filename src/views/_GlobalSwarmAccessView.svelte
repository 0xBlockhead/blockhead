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
	href={
		href === undefined ?
			resolve('/(swarm)/swarm/(swarmProtocol)/access')
		:
			href ?? undefined
	}
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
					{selection.entitySelector.scope}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const observedResourcesResource = selection.$$observedResources}
		<ResourceBoundary
			resource={observedResourcesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<SwarmResourcesView
						selection={observedResourcesResource}
						countResource={observedResourcesResource.count}
						title='Observed resources'
						id='observed-resources'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GlobalSwarmAccess_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
