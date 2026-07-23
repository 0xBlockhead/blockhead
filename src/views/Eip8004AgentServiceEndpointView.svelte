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
	import { UrlString } from '$/schema/UrlString.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.Eip8004AgentServiceEndpoint>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Eip8004AgentServiceEndpoint>
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
	const eip8004AgentServiceEndpoint = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			protocolKind: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			protocolKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 agent service endpoint')
	const viewDomId = $derived('eip8004agent-service-endpoint-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AgentPaymentRequirement_TimestampsView from '$/views/AgentPaymentRequirement_TimestampsView.svelte'
	import Eip8004AgentRegistrationFileView from '$/views/Eip8004AgentRegistrationFileView.svelte'
	import McpServerView from '$/views/McpServerView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004AgentServiceEndpoint}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'protocolKind')}
			{@const endpointUrl0 = pendingEntity.endpointUrl}
			{#if endpointUrl0 !== undefined && endpointUrl0 !== null}
				<svelte:element
					this={'a'}
					href={String(endpointUrl0)}
					target="_blank"
					rel="noreferrer noopener"
				>
					<TruncatedValue value={String(endpointUrl0)} />
				</svelte:element>
			{/if}
		{:else}
			<ResourceBoundary resource={eip8004AgentServiceEndpoint}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endpointUrl0 = resolvedEntity.endpointUrl}
					{#if endpointUrl0 !== undefined && endpointUrl0 !== null}
						<svelte:element
							this={'a'}
							href={String(endpointUrl0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(endpointUrl0)} />
						</svelte:element>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'protocolKind')}
			{[String((pendingEntity.endpointKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={eip8004AgentServiceEndpoint}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.endpointKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'protocolKind')}
			{@const protocolKind0 = pendingEntity.protocolKind}
			{#if protocolKind0 !== undefined && protocolKind0 !== null}
				<span data-text="muted">
					{String((protocolKind0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={eip8004AgentServiceEndpoint}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolKind0 = resolvedEntity.protocolKind}
					{#if protocolKind0 !== undefined && protocolKind0 !== null}
						<span data-text="muted">
							{String((protocolKind0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Registration file</dt>
				<dd>
					<Eip8004AgentRegistrationFileView
						selection={select(EntityType.Eip8004AgentRegistrationFile, selection.entitySelector.$registrationFile)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Endpoint kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									endpointKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const endpointKind = resolvedEntity.endpointKind}
							{#if endpointKind !== undefined && endpointKind !== null}
								{String((endpointKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Endpoint URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									endpointUrl: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const endpointUrl = resolvedEntity.endpointUrl}
							{#if endpointUrl !== undefined && endpointUrl !== null}
								<svelte:element
									this={'a'}
									href={String(endpointUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpointUrl)} />
								</svelte:element>
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
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								{String((version) ?? '')}
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
							protocolKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolKind = resolvedEntity.protocolKind}
					{#if protocolKind !== undefined && protocolKind !== null}
						<div>
							<dt>Protocol kind</dt>
							<dd>
								{String((protocolKind) ?? '')}
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
							active: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const active = resolvedEntity.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>Active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$mcpServer}
			>
				{#snippet children(mcpServer)}
					{#if mcpServer != null && mcpServer[EntityMetaKey.Selector] != null}
						<div>
							<dt>MCP server</dt>
							<dd>
								<McpServerView
									selection={select(EntityType.McpServer, mcpServer[EntityMetaKey.Selector])}
									prefetched={mcpServer}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const eip8004AgentServiceEndpointAgentPaymentRequirementTimestampsViewPaymentRequirementsResource = selection.$$paymentRequirements}
		<ResourceBoundary
			resource={eip8004AgentServiceEndpointAgentPaymentRequirementTimestampsViewPaymentRequirementsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<AgentPaymentRequirement_TimestampsView
					selection={eip8004AgentServiceEndpointAgentPaymentRequirementTimestampsViewPaymentRequirementsResource}
					countResource={eip8004AgentServiceEndpointAgentPaymentRequirementTimestampsViewPaymentRequirementsResource.count}
					title='Payment requirements'
					id='AgentPaymentRequirement_TimestampsView-payment-requirements'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
