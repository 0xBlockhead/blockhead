<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AgentPaymentRequirement_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AgentPaymentRequirement_Timestamp>>
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
	const agentPaymentRequirementTimestamp = $derived(selection({}))
	const titleFallback = $derived('agent payment requirement timestamp')
	const viewDomId = $derived('agent-payment-requirement-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import A2aAgentServiceView from '$/views/A2aAgentServiceView.svelte'
	import McpServerView from '$/views/McpServerView.svelte'
	import Eip8004AgentServiceEndpointView from '$/views/Eip8004AgentServiceEndpointView.svelte'
	import BlockheadAgentConnectionView from '$/views/BlockheadAgentConnectionView.svelte'
</script>


<EntityView
	entityType={EntityType.AgentPaymentRequirement_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={agentPaymentRequirementTimestamp}>
			{#snippet Pending()}
				{title || 'agent payment requirement timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subject kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									subjectKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const subjectKind = pendingEntity.subjectKind}
							{#if subjectKind !== undefined && subjectKind !== null}
								{String((subjectKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const subjectKind = resolvedEntity.subjectKind}
							{#if subjectKind !== undefined && subjectKind !== null}
								{String((subjectKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>payment protocol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									paymentProtocol: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const paymentProtocol = pendingEntity.paymentProtocol}
							{#if paymentProtocol !== undefined && paymentProtocol !== null}
								{String((paymentProtocol) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const paymentProtocol = resolvedEntity.paymentProtocol}
							{#if paymentProtocol !== undefined && paymentProtocol !== null}
								{String((paymentProtocol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$a2aAgentService}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(a2aAgentService)}
					{#if a2aAgentService != null && a2aAgentService[EntityMetaKey.Selector] != null}
						<div>
							<dt>A2A agent service</dt>
							<dd>
								<A2aAgentServiceView
									selection={select(EntityType.A2aAgentService, a2aAgentService[EntityMetaKey.Selector])}
									prefetched={a2aAgentService}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$mcpServer}
			>
				{#snippet Pending()}{/snippet}

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

			<ResourceBoundary
				resource={selection.$eip8004ServiceEndpoint}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(eip8004AgentServiceEndpoint)}
					{#if eip8004AgentServiceEndpoint != null && eip8004AgentServiceEndpoint[EntityMetaKey.Selector] != null}
						<div>
							<dt>EIP-8004 service endpoint</dt>
							<dd>
								<Eip8004AgentServiceEndpointView
									selection={select(EntityType.Eip8004AgentServiceEndpoint, eip8004AgentServiceEndpoint[EntityMetaKey.Selector])}
									prefetched={eip8004AgentServiceEndpoint}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$blockheadConnection}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadAgentConnection)}
					{#if blockheadAgentConnection != null && blockheadAgentConnection[EntityMetaKey.Selector] != null}
						<div>
							<dt>blockhead connection</dt>
							<dd>
								<BlockheadAgentConnectionView
									selection={select(EntityType.BlockheadAgentConnection, blockheadAgentConnection[EntityMetaKey.Selector])}
									prefetched={blockheadAgentConnection}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							required: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const required = pendingEntity.required}
					{#if required !== undefined && required !== null}
						<div>
							<dt>required</dt>
							<dd>
								{required ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const required = resolvedEntity.required}
					{#if required !== undefined && required !== null}
						<div>
							<dt>required</dt>
							<dd>
								{required ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							httpStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const httpStatus = pendingEntity.httpStatus}
					{#if httpStatus !== undefined && httpStatus !== null}
						<div>
							<dt>HTTP status</dt>
							<dd>
								{String((httpStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const httpStatus = resolvedEntity.httpStatus}
					{#if httpStatus !== undefined && httpStatus !== null}
						<div>
							<dt>HTTP status</dt>
							<dd>
								{String((httpStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							requestMethod: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requestMethod = pendingEntity.requestMethod}
					{#if requestMethod !== undefined && requestMethod !== null}
						<div>
							<dt>request method</dt>
							<dd>
								{String((requestMethod) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requestMethod = resolvedEntity.requestMethod}
					{#if requestMethod !== undefined && requestMethod !== null}
						<div>
							<dt>request method</dt>
							<dd>
								{String((requestMethod) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resourceUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const resourceUrl = pendingEntity.resourceUrl}
					{#if resourceUrl !== undefined && resourceUrl !== null}
						<div>
							<dt>resource URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(resourceUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(resourceUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resourceUrl = resolvedEntity.resourceUrl}
					{#if resourceUrl !== undefined && resourceUrl !== null}
						<div>
							<dt>resource URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(resourceUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(resourceUrl)} />
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
							paymentRequiredHeader: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const paymentRequiredHeader = pendingEntity.paymentRequiredHeader}
					{#if paymentRequiredHeader !== undefined && paymentRequiredHeader !== null}
						<div>
							<dt>payment required header</dt>
							<dd>
								{String((paymentRequiredHeader) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const paymentRequiredHeader = resolvedEntity.paymentRequiredHeader}
					{#if paymentRequiredHeader !== undefined && paymentRequiredHeader !== null}
						<div>
							<dt>payment required header</dt>
							<dd>
								{String((paymentRequiredHeader) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							paymentSignatureHeader: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const paymentSignatureHeader = pendingEntity.paymentSignatureHeader}
					{#if paymentSignatureHeader !== undefined && paymentSignatureHeader !== null}
						<div>
							<dt>payment signature header</dt>
							<dd>
								<TruncatedValue value={String((paymentSignatureHeader) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const paymentSignatureHeader = resolvedEntity.paymentSignatureHeader}
					{#if paymentSignatureHeader !== undefined && paymentSignatureHeader !== null}
						<div>
							<dt>payment signature header</dt>
							<dd>
								<TruncatedValue value={String((paymentSignatureHeader) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							paymentResponseHeader: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const paymentResponseHeader = pendingEntity.paymentResponseHeader}
					{#if paymentResponseHeader !== undefined && paymentResponseHeader !== null}
						<div>
							<dt>payment response header</dt>
							<dd>
								{String((paymentResponseHeader) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const paymentResponseHeader = resolvedEntity.paymentResponseHeader}
					{#if paymentResponseHeader !== undefined && paymentResponseHeader !== null}
						<div>
							<dt>payment response header</dt>
							<dd>
								{String((paymentResponseHeader) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							facilitatorUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const facilitatorUrl = pendingEntity.facilitatorUrl}
					{#if facilitatorUrl !== undefined && facilitatorUrl !== null}
						<div>
							<dt>facilitator URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(facilitatorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(facilitatorUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const facilitatorUrl = resolvedEntity.facilitatorUrl}
					{#if facilitatorUrl !== undefined && facilitatorUrl !== null}
						<div>
							<dt>facilitator URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(facilitatorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(facilitatorUrl)} />
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
							scheme: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const scheme = pendingEntity.scheme}
					{#if scheme !== undefined && scheme !== null}
						<div>
							<dt>scheme</dt>
							<dd>
								{String((scheme) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const scheme = resolvedEntity.scheme}
					{#if scheme !== undefined && scheme !== null}
						<div>
							<dt>scheme</dt>
							<dd>
								{String((scheme) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxAmountRequired: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxAmountRequired = pendingEntity.maxAmountRequired}
					{#if maxAmountRequired !== undefined && maxAmountRequired !== null}
						<div>
							<dt>max amount required</dt>
							<dd>
								{String((maxAmountRequired) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxAmountRequired = resolvedEntity.maxAmountRequired}
					{#if maxAmountRequired !== undefined && maxAmountRequired !== null}
						<div>
							<dt>max amount required</dt>
							<dd>
								{String((maxAmountRequired) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxTimeoutSeconds: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxTimeoutSeconds = pendingEntity.maxTimeoutSeconds}
					{#if maxTimeoutSeconds !== undefined && maxTimeoutSeconds !== null}
						<div>
							<dt>max timeout seconds</dt>
							<dd>
								{String((maxTimeoutSeconds) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxTimeoutSeconds = resolvedEntity.maxTimeoutSeconds}
					{#if maxTimeoutSeconds !== undefined && maxTimeoutSeconds !== null}
						<div>
							<dt>max timeout seconds</dt>
							<dd>
								{String((maxTimeoutSeconds) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							evidenceUri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const evidenceUri = pendingEntity.evidenceUri}
					{#if evidenceUri !== undefined && evidenceUri !== null}
						<div>
							<dt>evidence URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(evidenceUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(evidenceUri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const evidenceUri = resolvedEntity.evidenceUri}
					{#if evidenceUri !== undefined && evidenceUri !== null}
						<div>
							<dt>evidence URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(evidenceUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(evidenceUri)} />
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
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = pendingEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
