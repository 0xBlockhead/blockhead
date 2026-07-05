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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpToolCall>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AcpToolCall>>
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
	const acpToolCall = $derived(selection({
		sources: [
			Source.AcpLocal_JsonRpc,
		],
		fields: {
			toolName: true,
			serverName: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.toolCallId ?? prefetched.toolCallId) ?? '')].filter(Boolean).join(' ') || 'ACP tool call')
	const viewDomId = $derived('acp-tool-call-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
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
		<ResourceBoundary resource={acpToolCall}>
			{#snippet Pending()}
				{[String((selection.entitySelector.toolCallId ?? prefetched.toolCallId) ?? '')].filter(Boolean).join(' ') || title || 'ACP tool call'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.toolCallId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpToolCall}>
			{#snippet Pending()}
				{[String((prefetched.toolName) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.toolCallId ?? prefetched.toolCallId) ?? '')].filter(Boolean).join(' ') || title || 'ACP tool call'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.toolName) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.toolCallId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpToolCall}>
			{#snippet Pending()}
				{@const serverName0 = prefetched.serverName}
				{#if serverName0 !== undefined && serverName0 !== null}
					<span data-text="muted">
						{String((serverName0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>prompt turn</dt>
				<dd>
					<AcpPromptTurnView
						selection={select(EntityType.AcpPromptTurn, selection.entitySelector.$promptTurn)}
						layout={EntityLayout.Title}
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
								fields: {
									toolCallId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const toolCallId = selection.entitySelector.toolCallId ?? prefetched.toolCallId}
							{#if toolCallId !== undefined && toolCallId !== null}
								{String((toolCallId) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							toolName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const toolName = prefetched.toolName}
					{#if toolName !== undefined && toolName !== null}
						<div>
							<dt>tool name</dt>
							<dd>
								{String((toolName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							serverName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const serverName = prefetched.serverName}
					{#if serverName !== undefined && serverName !== null}
						<div>
							<dt>server name</dt>
							<dd>
								{String((serverName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							startedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startedAt = prefetched.startedAt}
					{#if startedAt !== undefined && startedAt !== null}
						<div>
							<dt>started AT</dt>
							<dd>
								<Timestamp timestamp={Number(startedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const completedAt = prefetched.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							inputHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inputHashAlgorithm = prefetched.inputHashAlgorithm}
					{#if inputHashAlgorithm !== undefined && inputHashAlgorithm !== null}
						<div>
							<dt>input hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((inputHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							inputHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inputHash = prefetched.inputHash}
					{#if inputHash !== undefined && inputHash !== null}
						<div>
							<dt>input hash</dt>
							<dd>
								<TruncatedValue value={String((inputHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							outputHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const outputHashAlgorithm = prefetched.outputHashAlgorithm}
					{#if outputHashAlgorithm !== undefined && outputHashAlgorithm !== null}
						<div>
							<dt>output hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((outputHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							outputHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const outputHash = prefetched.outputHash}
					{#if outputHash !== undefined && outputHash !== null}
						<div>
							<dt>output hash</dt>
							<dd>
								<TruncatedValue value={String((outputHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<AcpToolCall_TimestampsView
				selection={selection[EntityProxyField]<EntityType.AcpToolCall_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No ACP tool call observations.'
				id='AcpToolCall_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
