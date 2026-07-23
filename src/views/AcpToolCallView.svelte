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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AcpToolCall>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AcpToolCall>
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
	const acpToolCall = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			toolName: true,
			serverName: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			toolName: true,
			serverName: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.toolCallId) ?? '')].filter(Boolean).join(' ') || 'ACP tool call')
	const viewDomId = $derived('acp-tool-call-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AcpToolCall_TimestampsView from '$/views/AcpToolCall_TimestampsView.svelte'
	import AcpPromptTurnView from '$/views/AcpPromptTurnView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpToolCall}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'toolName') && Object.hasOwn(prefetched, 'serverName')}
			{[String((pendingEntity.toolCallId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={acpToolCall}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.toolCallId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'toolName') && Object.hasOwn(prefetched, 'serverName')}
			{[String((pendingEntity.toolName) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.toolCallId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={acpToolCall}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.toolName) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.toolCallId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'toolName') && Object.hasOwn(prefetched, 'serverName')}
			{@const serverName0 = pendingEntity.serverName}
			{#if serverName0 !== undefined && serverName0 !== null}
				<span data-text="muted">
					{String((serverName0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={acpToolCall}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const serverName0 = resolvedEntity.serverName}
					{#if serverName0 !== undefined && serverName0 !== null}
						<span data-text="muted">
							{String((serverName0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>prompt turn</dt>
				<dd>
					<AcpPromptTurnView
						selection={select(EntityType.AcpPromptTurn, selection.entitySelector.$promptTurn)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>tool call ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									toolCallId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const toolCallId = resolvedEntity.toolCallId}
							{#if toolCallId !== undefined && toolCallId !== null}
								{String((toolCallId) ?? '')}
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
							toolName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toolName = resolvedEntity.toolName}
					{#if toolName !== undefined && toolName !== null}
						<div>
							<dt>tool name</dt>
							<dd>
								{String((toolName) ?? '')}
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
							serverName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const serverName = resolvedEntity.serverName}
					{#if serverName !== undefined && serverName !== null}
						<div>
							<dt>server name</dt>
							<dd>
								{String((serverName) ?? '')}
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
							startedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startedAt = resolvedEntity.startedAt}
					{#if startedAt !== undefined && startedAt !== null}
						<div>
							<dt>started AT</dt>
							<dd>
								<Timestamp timestamp={Number(startedAt)} />
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
							completedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const completedAt = resolvedEntity.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
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
							inputHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputHashAlgorithm = resolvedEntity.inputHashAlgorithm}
					{#if inputHashAlgorithm !== undefined && inputHashAlgorithm !== null}
						<div>
							<dt>input hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((inputHashAlgorithm) ?? '')} />
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
							inputHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputHash = resolvedEntity.inputHash}
					{#if inputHash !== undefined && inputHash !== null}
						<div>
							<dt>input hash</dt>
							<dd>
								<TruncatedValue value={String((inputHash) ?? '')} />
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
							outputHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outputHashAlgorithm = resolvedEntity.outputHashAlgorithm}
					{#if outputHashAlgorithm !== undefined && outputHashAlgorithm !== null}
						<div>
							<dt>output hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((outputHashAlgorithm) ?? '')} />
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
							outputHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outputHash = resolvedEntity.outputHash}
					{#if outputHash !== undefined && outputHash !== null}
						<div>
							<dt>output hash</dt>
							<dd>
								<TruncatedValue value={String((outputHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const acpToolCallAcpToolCallTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={acpToolCallAcpToolCallTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<AcpToolCall_TimestampsView
					selection={acpToolCallAcpToolCallTimestampsViewTimestampsResource}
					countResource={acpToolCallAcpToolCallTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='AcpToolCall_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
