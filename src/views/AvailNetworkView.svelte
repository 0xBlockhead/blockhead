<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AvailNetwork> = $props()

	const titleFallback = 'avail network'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AvailNetwork_TimestampsView from '$/views/AvailNetwork_TimestampsView.svelte'
	import AvailBlocksView from '$/views/AvailBlocksView.svelte'
	import AvailAppIdsView from '$/views/AvailAppIdsView.svelte'
	import AvailDataSubmissionsView from '$/views/AvailDataSubmissionsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AvailNetwork}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		{titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const availNetworkAvailNetworkTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={availNetworkAvailNetworkTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvailNetwork_TimestampsView
						selection={availNetworkAvailNetworkTimestampsViewTimestampsResource}
						countResource={availNetworkAvailNetworkTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const availNetworkAvailBlocksViewBlocksResource = selection.$$blocks}
		<ResourceBoundary
			resource={availNetworkAvailBlocksViewBlocksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvailBlocksView
						selection={availNetworkAvailBlocksViewBlocksResource}
						countResource={availNetworkAvailBlocksViewBlocksResource.count}
						title='blocks'
						id='blocks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const availNetworkAvailAppIdsViewAppIdsResource = selection.$$appIds}
		<ResourceBoundary
			resource={availNetworkAvailAppIdsViewAppIdsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvailAppIdsView
						selection={availNetworkAvailAppIdsViewAppIdsResource}
						countResource={availNetworkAvailAppIdsViewAppIdsResource.count}
						title='app ids'
						id='app-ids'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const availNetworkAvailDataSubmissionsViewDataSubmissionsResource = selection.$$dataSubmissions}
		<ResourceBoundary
			resource={availNetworkAvailDataSubmissionsViewDataSubmissionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvailDataSubmissionsView
						selection={availNetworkAvailDataSubmissionsViewDataSubmissionsResource}
						countResource={availNetworkAvailDataSubmissionsViewDataSubmissionsResource.count}
						title='data submissions'
						id='data-submissions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
