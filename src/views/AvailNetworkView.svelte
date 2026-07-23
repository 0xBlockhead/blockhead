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
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AvailNetwork>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AvailNetwork>
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
	const availNetwork = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'avail network'
	const viewDomId = $derived('avail-network-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={availNetwork}>
			{#snippet children(entity)}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={availNetwork}>
			{#snippet children(entity)}
				{titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
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
					id='AvailNetwork_TimestampsView-timestamps'
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
					id='AvailBlocksView-blocks'
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
					id='AvailAppIdsView-app-ids'
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
					id='AvailDataSubmissionsView-data-submissions'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
