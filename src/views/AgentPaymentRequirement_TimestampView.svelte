<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AgentPaymentRequirement_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import A2aAgentServiceView from '$/views/A2aAgentServiceView.svelte'
	import McpServerView from '$/views/McpServerView.svelte'
	import Eip8004AgentServiceEndpointView from '$/views/Eip8004AgentServiceEndpointView.svelte'
	import BlockheadAgentConnectionView from '$/views/BlockheadAgentConnectionView.svelte'
</script>


<EntityView
	entityType={EntityType.AgentPaymentRequirement_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>subject kind</dt>
				<dd>
					{selection.entitySelector.subjectKind}
				</dd>
			</div>

			<div>
				<dt>payment protocol</dt>
				<dd>
					{selection.entitySelector.paymentProtocol}
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$a2aAgentService}
			>
				{#snippet children(a2aAgentService)}
					{#if a2aAgentService != null}
						<div>
							<dt>A2A agent service</dt>
							<dd>
								<A2aAgentServiceView
									selection={select(EntityType.A2aAgentService, a2aAgentService[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$mcpServer}
			>
				{#snippet children(mcpServer)}
					{#if mcpServer != null}
						<div>
							<dt>MCP server</dt>
							<dd>
								<McpServerView
									selection={select(EntityType.McpServer, mcpServer[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$eip8004ServiceEndpoint}
			>
				{#snippet children(eip8004AgentServiceEndpoint)}
					{#if eip8004AgentServiceEndpoint != null}
						<div>
							<dt>EIP-8004 service endpoint</dt>
							<dd>
								<Eip8004AgentServiceEndpointView
									selection={select(EntityType.Eip8004AgentServiceEndpoint, eip8004AgentServiceEndpoint[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$blockheadConnection}
			>
				{#snippet children(blockheadAgentConnection)}
					{#if blockheadAgentConnection != null}
						<div>
							<dt>blockhead connection</dt>
							<dd>
								<BlockheadAgentConnectionView
									selection={select(EntityType.BlockheadAgentConnection, blockheadAgentConnection[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
				{#snippet children(entity)}
					{@const required = entity.required}
					{#if required != null}
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
				{#snippet children(entity)}
					{@const httpStatus = entity.httpStatus}
					{#if httpStatus != null}
						<div>
							<dt>HTTP status</dt>
							<dd>
								{httpStatus}
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
				{#snippet children(entity)}
					{@const requestMethod = entity.requestMethod}
					{#if requestMethod != null}
						<div>
							<dt>request method</dt>
							<dd>
								{requestMethod}
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
				{#snippet children(entity)}
					{@const resourceUrl = entity.resourceUrl}
					{#if resourceUrl != null}
						<div>
							<dt>resource URL</dt>
							<dd>
								<a
									href={resourceUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={resourceUrl} />
								</a>
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
				{#snippet children(entity)}
					{@const paymentRequiredHeader = entity.paymentRequiredHeader}
					{#if paymentRequiredHeader != null}
						<div>
							<dt>payment required header</dt>
							<dd>
								{paymentRequiredHeader}
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
				{#snippet children(entity)}
					{@const paymentSignatureHeader = entity.paymentSignatureHeader}
					{#if paymentSignatureHeader != null}
						<div>
							<dt>payment signature header</dt>
							<dd>
								{paymentSignatureHeader}
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
				{#snippet children(entity)}
					{@const paymentResponseHeader = entity.paymentResponseHeader}
					{#if paymentResponseHeader != null}
						<div>
							<dt>payment response header</dt>
							<dd>
								{paymentResponseHeader}
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
				{#snippet children(entity)}
					{@const facilitatorUrl = entity.facilitatorUrl}
					{#if facilitatorUrl != null}
						<div>
							<dt>facilitator URL</dt>
							<dd>
								<a
									href={facilitatorUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={facilitatorUrl} />
								</a>
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
				{#snippet children(entity)}
					{@const scheme = entity.scheme}
					{#if scheme != null}
						<div>
							<dt>scheme</dt>
							<dd>
								{scheme}
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
				{#snippet children(entity)}
					{@const maxAmountRequired = entity.maxAmountRequired}
					{#if maxAmountRequired != null}
						<div>
							<dt>max amount required</dt>
							<dd>
								{maxAmountRequired}
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
				{#snippet children(entity)}
					{@const maxTimeoutSeconds = entity.maxTimeoutSeconds}
					{#if maxTimeoutSeconds != null}
						<div>
							<dt>max timeout seconds</dt>
							<dd>
								{maxTimeoutSeconds}
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
				{#snippet children(entity)}
					{@const evidenceUri = entity.evidenceUri}
					{#if evidenceUri != null}
						<div>
							<dt>evidence URI</dt>
							<dd>
								<a
									href={evidenceUri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={evidenceUri} />
								</a>
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
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
