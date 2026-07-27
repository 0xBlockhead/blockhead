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
	}: EntitySelectionViewProps<EntityType.AcpSession> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.AcpLocal_JsonRpc,
		],
	}))
	const acpSession = $derived(viewSelection({
		fields: {
			workspaceUri: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.sessionId ?? '') || 'ACP session')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AcpPromptTurnsView from '$/views/AcpPromptTurnsView.svelte'
	import AcpAgentRuntimeView from '$/views/AcpAgentRuntimeView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpSession}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.sessionId ?? '') || 'ACP session'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$runtime}
		>
			{#snippet children(acpAgentRuntime)}
				{#if acpAgentRuntime != null}
					<AcpAgentRuntimeView
						selection={select(EntityType.AcpAgentRuntime, acpAgentRuntime[EntityMetaKey.Selector])}
						prefetched={acpAgentRuntime}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpSession}>
			{#snippet children(entity)}
				{@const workspaceUri0 = entity.workspaceUri}
				{#if workspaceUri0 != null}
					<span data-text="muted">
						<a
							href={String(workspaceUri0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(workspaceUri0)} />
						</a>
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
					{pendingEntity.sessionId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$runtime}
			>
				{#snippet children(acpAgentRuntime)}
					{#if acpAgentRuntime != null}
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
				resource={acpSession}
			>
				{#snippet children(entity)}
					{@const workspaceUri = entity.workspaceUri}
					{#if workspaceUri != null}
						<div>
							<dt>workspace URI</dt>
							<dd>
								<a
									href={String(workspaceUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(workspaceUri)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							mode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mode = entity.mode}
					{#if mode != null}
						<div>
							<dt>mode</dt>
							<dd>
								{mode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							listed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const listed = entity.listed}
					{#if listed != null}
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
					viewSelection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							loadedFromSessionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const loadedFromSessionId = entity.loadedFromSessionId}
					{#if loadedFromSessionId != null}
						<div>
							<dt>loaded from session ID</dt>
							<dd>
								{loadedFromSessionId}
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
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
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
					viewSelection({
						fields: {
							closedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const closedAt = entity.closedAt}
					{#if closedAt != null}
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
					viewSelection({
						fields: {
							deletedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deletedAt = entity.deletedAt}
					{#if deletedAt != null}
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
		{@const acpSessionAcpPromptTurnsViewPromptTurnsResource = selection.$$promptTurns}
		<ResourceBoundary
			resource={acpSessionAcpPromptTurnsViewPromptTurnsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AcpPromptTurnsView
						selection={acpSessionAcpPromptTurnsViewPromptTurnsResource}
						countResource={acpSessionAcpPromptTurnsViewPromptTurnsResource.count}
						title='prompt turns'
						id='prompt-turns'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
