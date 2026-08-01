<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalIpfsAccess> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IpfsResourcesView from '$/views/IpfsResourcesView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalIpfsAccess}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve('/(explore)/(ipfs)/ipfs/(ipfsProtocol)/access')
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		IPFS gateway access
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					{selection.entitySelector.scope}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const observedResourcesResource = selection.$$observedResources}
		<ResourceBoundary
			resource={observedResourcesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<IpfsResourcesView
						selection={observedResourcesResource}
						countResource={observedResourcesResource.count}
						title='Observed resources'
						id='observed-resources'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
