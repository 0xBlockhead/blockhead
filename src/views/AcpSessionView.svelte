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
	import { UrlString } from '$/schema/UrlString.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpSession>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AcpSession>>
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
		sources: [
			Source.AcpLocal_JsonRpc,
		],
		fields: {
			$runtime: true,
			workspaceUri: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.sessionId ?? prefetched.sessionId) ?? '')].filter(Boolean).join(' ') || 'ACP session')
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
		<ResourceBoundary resource={acpSession}>
			{#snippet Pending()}
				{[String((selection.entitySelector.sessionId ?? prefetched.sessionId) ?? '')].filter(Boolean).join(' ') || title || 'ACP session'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.sessionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpSession}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.AcpAgentRuntime, false>('$runtime')}
				>
					{#snippet children(acpAgentRuntime)}
						{#if acpAgentRuntime != null && acpAgentRuntime[EntityMetaKey.Selector] != null}
							<AcpAgentRuntimeView
								selection={select(EntityType.AcpAgentRuntime, acpAgentRuntime[EntityMetaKey.Selector])}
								prefetched={acpAgentRuntime}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.AcpAgentRuntime, false>('$runtime')}
				>
					{#snippet children(acpAgentRuntime)}
						{#if acpAgentRuntime != null && acpAgentRuntime[EntityMetaKey.Selector] != null}
							<AcpAgentRuntimeView
								selection={select(EntityType.AcpAgentRuntime, acpAgentRuntime[EntityMetaKey.Selector])}
								prefetched={acpAgentRuntime}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpSession}>
			{#snippet Pending()}
				{@const workspaceUri0 = prefetched.workspaceUri}
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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sessionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const sessionId = selection.entitySelector.sessionId ?? prefetched.sessionId}
							{#if sessionId !== undefined && sessionId !== null}
								{String((sessionId) ?? '')}
							{/if}
						{/snippet}

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
				resource={selection[EntityProxyField]<EntityType.AcpAgentRuntime, false>('$runtime')}
			>
				{#snippet children(acpAgentRuntime)}
					{#if acpAgentRuntime != null && acpAgentRuntime[EntityMetaKey.Selector] != null}
						<div>
							<dt>runtime</dt>
							<dd>
								<AcpAgentRuntimeView
									selection={select(EntityType.AcpAgentRuntime, acpAgentRuntime[EntityMetaKey.Selector])}
									prefetched={acpAgentRuntime}
									layout={EntityLayout.Title}
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
							workspaceUri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const workspaceUri = prefetched.workspaceUri}
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
						fields: {
							mode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mode = prefetched.mode}
					{#if mode !== undefined && mode !== null}
						<div>
							<dt>mode</dt>
							<dd>
								{String((mode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							listed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const listed = prefetched.listed}
					{#if listed !== undefined && listed !== null}
						<div>
							<dt>listed</dt>
							<dd>
								{listed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							loadedFromSessionId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const loadedFromSessionId = prefetched.loadedFromSessionId}
					{#if loadedFromSessionId !== undefined && loadedFromSessionId !== null}
						<div>
							<dt>loaded from session ID</dt>
							<dd>
								{String((loadedFromSessionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdAt = prefetched.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							closedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const closedAt = prefetched.closedAt}
					{#if closedAt !== undefined && closedAt !== null}
						<div>
							<dt>closed AT</dt>
							<dd>
								<Timestamp timestamp={Number(closedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							deletedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deletedAt = prefetched.deletedAt}
					{#if deletedAt !== undefined && deletedAt !== null}
						<div>
							<dt>deleted AT</dt>
							<dd>
								<Timestamp timestamp={Number(deletedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
				selection={selection[EntityProxyField]<EntityType.AcpPromptTurn>('$$promptTurns')}
				title='prompt turns'
				emptyText='No ACP prompt turns.'
				id='AcpPromptTurnsView-$$promptTurns'
			/>
		{/if}
	{/snippet}
</EntityView>
