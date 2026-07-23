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
			selection: RegisteredEntityProxyResource<EntityType.FedimintFederation>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.FedimintFederation>
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
	const fedimintFederation = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			name: true,
			consensusVersion: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			name: true,
			consensusVersion: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.federationId) ?? '')].filter(Boolean).join(' ') || 'Fedimint federation')
	const viewDomId = $derived('fedimint-federation-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FedimintFederation_TimestampsView from '$/views/FedimintFederation_TimestampsView.svelte'
	import FedimintGatewaysView from '$/views/FedimintGatewaysView.svelte'
</script>


<EntityView
	entityType={EntityType.FedimintFederation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'name') && Object.hasOwn(prefetched, 'consensusVersion')}
			{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={fedimintFederation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'name') && Object.hasOwn(prefetched, 'consensusVersion')}
			{[String((pendingEntity.consensusVersion) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={fedimintFederation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.consensusVersion) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>federation ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									federationId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const federationId = resolvedEntity.federationId}
							{#if federationId !== undefined && federationId !== null}
								{String((federationId) ?? '')}
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
							name: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
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
							consensusVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const consensusVersion = resolvedEntity.consensusVersion}
					{#if consensusVersion !== undefined && consensusVersion !== null}
						<div>
							<dt>consensus version</dt>
							<dd>
								{String((consensusVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							guardianCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const guardianCount = resolvedEntity.guardianCount}
					{#if guardianCount !== undefined && guardianCount !== null}
						<div>
							<dt>guardian count</dt>
							<dd>
								<NumberValue
									value={guardianCount}
								/>
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
							guardianThreshold: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const guardianThreshold = resolvedEntity.guardianThreshold}
					{#if guardianThreshold !== undefined && guardianThreshold !== null}
						<div>
							<dt>guardian threshold</dt>
							<dd>
								<NumberValue
									value={guardianThreshold}
								/>
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
							clientConfigJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientConfigJson = resolvedEntity.clientConfigJson}
					{#if clientConfigJson !== undefined && clientConfigJson !== null}
						<div>
							<dt>client config JSON</dt>
							<dd>
								{String((clientConfigJson) ?? '')}
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
							moduleConfigJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const moduleConfigJson = resolvedEntity.moduleConfigJson}
					{#if moduleConfigJson !== undefined && moduleConfigJson !== null}
						<div>
							<dt>module config JSON</dt>
							<dd>
								{String((moduleConfigJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const fedimintFederationFedimintFederationTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={fedimintFederationFedimintFederationTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<FedimintFederation_TimestampsView
					selection={fedimintFederationFedimintFederationTimestampsViewTimestampsResource}
					countResource={fedimintFederationFedimintFederationTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='FedimintFederation_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const fedimintFederationFedimintGatewaysViewGatewaysResource = selection.$$gateways}
		<ResourceBoundary
			resource={fedimintFederationFedimintGatewaysViewGatewaysResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<FedimintGatewaysView
					selection={fedimintFederationFedimintGatewaysViewGatewaysResource}
					countResource={fedimintFederationFedimintGatewaysViewGatewaysResource.count}
					title='gateways'
					id='FedimintGatewaysView-gateways'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
