<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
			selection: RegisteredEntityProxyResource<EntityType.FedimintGateway>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.FedimintGateway>
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
	const fedimintGateway = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			apiUrl: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			apiUrl: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.gatewayId) ?? '')].filter(Boolean).join(' ') || 'Fedimint gateway')
	const viewDomId = $derived('fedimint-gateway-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FedimintGateway_TimestampsView from '$/views/FedimintGateway_TimestampsView.svelte'
	import FedimintFederationsView from '$/views/FedimintFederationsView.svelte'
</script>


<EntityView
	entityType={EntityType.FedimintGateway}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'apiUrl')}
			{[String((pendingEntity.gatewayId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={fedimintGateway}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.gatewayId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'apiUrl')}
			{[String((pendingEntity.apiUrl) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.gatewayId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={fedimintGateway}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.apiUrl) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.gatewayId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>gateway ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									gatewayId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const gatewayId = resolvedEntity.gatewayId}
							{#if gatewayId !== undefined && gatewayId !== null}
								{String((gatewayId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							apiUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const apiUrl = resolvedEntity.apiUrl}
					{#if apiUrl !== undefined && apiUrl !== null}
						<div>
							<dt>API URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(apiUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(apiUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							nodePubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodePubkey = resolvedEntity.nodePubkey}
					{#if nodePubkey !== undefined && nodePubkey !== null}
						<div>
							<dt>node public key</dt>
							<dd>
								{String((nodePubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const fedimintGatewayFedimintGatewayTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={fedimintGatewayFedimintGatewayTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<FedimintGateway_TimestampsView
					selection={fedimintGatewayFedimintGatewayTimestampsViewTimestampsResource}
					countResource={fedimintGatewayFedimintGatewayTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='FedimintGateway_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const fedimintGatewayFedimintFederationsViewFederationsResource = selection.$$federations}
		<ResourceBoundary
			resource={fedimintGatewayFedimintFederationsViewFederationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<FedimintFederationsView
					selection={fedimintGatewayFedimintFederationsViewFederationsResource}
					countResource={fedimintGatewayFedimintFederationsViewFederationsResource.count}
					title='federations'
					id='FedimintFederationsView-federations'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
