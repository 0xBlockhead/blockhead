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
	}: EntitySelectionViewProps<EntityType._GlobalIpfsAccess> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'global IPFS access'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IpfsResourcesView from '$/views/IpfsResourcesView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalIpfsAccess}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={href ?? resolve('/(explore)/(ipfs)/ipfs/(ipfsProtocol)/access')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		global IPFS access
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
		{@const globalIpfsAccessIpfsResourcesViewObservedResourcesResource = selection.$$observedResources}
		<ResourceBoundary
			resource={globalIpfsAccessIpfsResourcesViewObservedResourcesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<IpfsResourcesView
						selection={globalIpfsAccessIpfsResourcesViewObservedResourcesResource}
						countResource={globalIpfsAccessIpfsResourcesViewObservedResourcesResource.count}
						title='Observed resources'
						id='observed-resources'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
