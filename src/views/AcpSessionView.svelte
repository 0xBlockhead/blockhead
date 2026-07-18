<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.AcpSession>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AcpSession>>
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
	const acpSession = $derived(selection({
		sources: selection.sources,
		fields: {
			workspaceUri: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.sessionId) ?? '')].filter(Boolean).join(' ') || 'ACP session')
	const viewDomId = $derived('acp-session-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AcpPromptTurnsView from '$/views/AcpPromptTurnsView.svelte'
	import AcpAgentRuntimeView from '$/views/AcpAgentRuntimeView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpSession}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.sessionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={acpSession}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.sessionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={selection.$runtime}
					>
						{#snippet children(acpAgentRuntime)}
							{#if acpAgentRuntime != null && acpAgentRuntime[EntityMetaKey.Selector] != null}
								<AcpAgentRuntimeView
									selection={select(EntityType.AcpAgentRuntime, acpAgentRuntime[EntityMetaKey.Selector])}
									prefetched={acpAgentRuntime}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={acpSession}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$runtime}
					>
						{#snippet children(acpAgentRuntime)}
							{#if acpAgentRuntime != null && acpAgentRuntime[EntityMetaKey.Selector] != null}
								<AcpAgentRuntimeView
									selection={select(EntityType.AcpAgentRuntime, acpAgentRuntime[EntityMetaKey.Selector])}
									prefetched={acpAgentRuntime}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const workspaceUri0 = pendingEntity.workspaceUri}
			{#if workspaceUri0 !== undefined && workspaceUri0 !== null}
				<span data-text="muted">
					<svelte:element
						this={'a'}
						href={String(workspaceUri0)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(workspaceUri0)} />
					</svelte:element>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={acpSession}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const workspaceUri0 = resolvedEntity.workspaceUri}
					{#if workspaceUri0 !== undefined && workspaceUri0 !== null}
						<span data-text="muted">
							<svelte:element
								this={'a'}
								href={String(workspaceUri0)}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={String(workspaceUri0)} />
							</svelte:element>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									sessionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sessionId = resolvedEntity.sessionId}
							{#if sessionId !== undefined && sessionId !== null}
								{String((sessionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$runtime}
			>
				{#snippet children(acpAgentRuntime)}
					{#if acpAgentRuntime != null && acpAgentRuntime[EntityMetaKey.Selector] != null}
						<div>
							<dt>runtime</dt>
							<dd>
								<AcpAgentRuntimeView
									selection={select(EntityType.AcpAgentRuntime, acpAgentRuntime[EntityMetaKey.Selector])}
									prefetched={acpAgentRuntime}
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
						sources: selection.sources,
						fields: {
							workspaceUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const workspaceUri = resolvedEntity.workspaceUri}
					{#if workspaceUri !== undefined && workspaceUri !== null}
						<div>
							<dt>workspace URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(workspaceUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(workspaceUri)} />
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
							mode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mode = resolvedEntity.mode}
					{#if mode !== undefined && mode !== null}
						<div>
							<dt>mode</dt>
							<dd>
								{String((mode) ?? '')}
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
							listed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const listed = resolvedEntity.listed}
					{#if listed !== undefined && listed !== null}
						<div>
							<dt>listed</dt>
							<dd>
								{listed ? 'Yes' : 'No'}
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
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
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
							loadedFromSessionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const loadedFromSessionId = resolvedEntity.loadedFromSessionId}
					{#if loadedFromSessionId !== undefined && loadedFromSessionId !== null}
						<div>
							<dt>loaded from session ID</dt>
							<dd>
								{String((loadedFromSessionId) ?? '')}
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
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
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
							closedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const closedAt = resolvedEntity.closedAt}
					{#if closedAt !== undefined && closedAt !== null}
						<div>
							<dt>closed AT</dt>
							<dd>
								<Timestamp timestamp={Number(closedAt)} />
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
							deletedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deletedAt = resolvedEntity.deletedAt}
					{#if deletedAt !== undefined && deletedAt !== null}
						<div>
							<dt>deleted AT</dt>
							<dd>
								<Timestamp timestamp={Number(deletedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AcpPromptTurnsView
				selection={
						selection.$$promptTurns({
							count: true,
						})
					}
				title='prompt turns'
				emptyText='No ACP prompt turns.'
				id='AcpPromptTurnsView-prompt-turns'
			/>
		{/if}
	{/snippet}
</EntityView>
