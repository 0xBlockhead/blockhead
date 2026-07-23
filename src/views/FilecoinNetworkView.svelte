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
	import { Source } from '$/sources/Source.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.FilecoinNetwork>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.FilecoinNetwork>
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
	const filecoinNetwork = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'filecoin network'
	const viewDomId = $derived('filecoin-network-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FilecoinNetwork_TimestampsView from '$/views/FilecoinNetwork_TimestampsView.svelte'
	import FilecoinTipsetsView from '$/views/FilecoinTipsetsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={filecoinNetwork}>
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
		<ResourceBoundary resource={filecoinNetwork}>
			{#snippet children(entity)}
				{titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Filecoin-specific view over a canonical Network row, including Lotus endpoints, chain head observations, and tipsets.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
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

			<div>
				<dt>RPC endpoints</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									rpcEndpoints: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const rpcEndpoints = resolvedEntity.rpcEndpoints}
							{#if rpcEndpoints !== undefined && rpcEndpoints !== null}
								{rpcEndpoints.values.map((value) => String((value.url) ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const filecoinNetworkFilecoinNetworkTimestampsViewTimestampsResource = selection
		.$$timestamps({
			sources: [
				Source.Lotus_JsonRpc,
			],
		})}
				<ResourceBoundary
					resource={filecoinNetworkFilecoinNetworkTimestampsViewTimestampsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<FilecoinNetwork_TimestampsView
							selection={filecoinNetworkFilecoinNetworkTimestampsViewTimestampsResource}
							countResource={filecoinNetworkFilecoinNetworkTimestampsViewTimestampsResource.count}
							title='Observations'
							id='FilecoinNetwork_TimestampsView-timestamps'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const filecoinNetworkFilecoinTipsetsViewTipsetsResource = selection
		.$$tipsets({
			sources: [
				Source.Lotus_JsonRpc,
			],
		})}
				<ResourceBoundary
					resource={filecoinNetworkFilecoinTipsetsViewTipsetsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<FilecoinTipsetsView
							selection={filecoinNetworkFilecoinTipsetsViewTipsetsResource}
							countResource={filecoinNetworkFilecoinTipsetsViewTipsetsResource.count}
							title='Tipsets'
							id='FilecoinTipsetsView-tipsets'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
