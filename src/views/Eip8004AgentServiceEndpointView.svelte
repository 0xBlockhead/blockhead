<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.Eip8004AgentServiceEndpoint> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Eip8004Scan_Rest,
		],
	}))
	const eip8004AgentServiceEndpoint = $derived(viewSelection({
		fields: {
			protocolKind: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.endpointUrl ?? '') || 'EIP-8004 agent service endpoint')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AgentPaymentRequirement_TimestampsView from '$/views/AgentPaymentRequirement_TimestampsView.svelte'
	import Eip8004AgentRegistrationFileView from '$/views/Eip8004AgentRegistrationFileView.svelte'
	import McpServerView from '$/views/McpServerView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004AgentServiceEndpoint}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<a
			href={String(pendingEntity.endpointUrl)}
			target="_blank"
			rel="noreferrer noopener"
		>
			<TruncatedValue value={String(pendingEntity.endpointUrl)} />
		</a>
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.endpointKind ?? '') || String(pendingEntity.endpointUrl ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eip8004AgentServiceEndpoint}>
			{#snippet children(entity)}
				{@const protocolKind0 = entity.protocolKind}
				{#if protocolKind0 != null}
					<span data-text="muted">
						{protocolKind0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
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
					{pendingEntity.endpointKind}
				</dd>
			</div>

			<div>
				<dt>Endpoint URL</dt>
				<dd>
					<a
						href={String(pendingEntity.endpointUrl)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(pendingEntity.endpointUrl)} />
					</a>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>Version</dt>
							<dd>
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={eip8004AgentServiceEndpoint}
			>
				{#snippet children(entity)}
					{@const protocolKind = entity.protocolKind}
					{#if protocolKind != null}
						<div>
							<dt>Protocol kind</dt>
							<dd>
								{protocolKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const active = entity.active}
					{#if active != null}
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
					{#if mcpServer != null}
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
						id='payment-requirements'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
