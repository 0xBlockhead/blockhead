<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.FedimintGateway>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FedimintGateway>>
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
	const fedimintGateway = $derived(selection({
		fields: {
			apiUrl: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.gatewayId ?? prefetched.gatewayId) ?? '')].filter(Boolean).join(' ') || 'Fedimint gateway')
	const viewDomId = $derived('fedimint-gateway-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
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
		<ResourceBoundary resource={fedimintGateway}>
			{#snippet Pending()}
				{[String((selection.entitySelector.gatewayId ?? prefetched.gatewayId) ?? '')].filter(Boolean).join(' ') || title || 'Fedimint gateway'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.gatewayId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={fedimintGateway}>
			{#snippet Pending()}
				{[String((prefetched.apiUrl) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.gatewayId ?? prefetched.gatewayId) ?? '')].filter(Boolean).join(' ') || title || 'Fedimint gateway'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.apiUrl) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.gatewayId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>gateway ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									gatewayId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const gatewayId = selection.entitySelector.gatewayId ?? prefetched.gatewayId}
							{#if gatewayId !== undefined && gatewayId !== null}
								{String((gatewayId) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							apiUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const apiUrl = prefetched.apiUrl}
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
						fields: {
							nodePubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodePubkey = prefetched.nodePubkey}
					{#if nodePubkey !== undefined && nodePubkey !== null}
						<div>
							<dt>node public key</dt>
							<dd>
								{String((nodePubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<FedimintGateway_TimestampsView
				selection={selection[EntityProxyField]<EntityType.FedimintGateway_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No observations yet.'
				id='FedimintGateway_TimestampsView-$$timestamps'
			/>

			<FedimintFederationsView
				selection={selection[EntityProxyField]<EntityType.FedimintFederation>('$$federations')}
				title='federations'
				emptyText='No federations found.'
				id='FedimintFederationsView-$$federations'
			/>
		{/if}
	{/snippet}
</EntityView>
