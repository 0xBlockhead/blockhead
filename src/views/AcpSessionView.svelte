<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	title={title ?? (selection.entitySelector.sessionId || 'ACP session')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$runtime}
		>
			{#snippet children(acpAgentRuntime)}
				{#if acpAgentRuntime != null}
					<AcpAgentRuntimeView
						selection={select(EntityType.AcpAgentRuntime, acpAgentRuntime[EntityMetaKey.Selector])}
						prefetched={acpAgentRuntime}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpSession}>
			{#snippet children(entity)}
				{@const workspaceUri = entity.workspaceUri}
				{#if workspaceUri != null}
					<span data-text="muted">
						<a
							href={workspaceUri}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={workspaceUri} />
						</a>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>session ID</dt>
				<dd>
					{selection.entitySelector.sessionId}
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
									href={workspaceUri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={workspaceUri} />
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
								<Timestamp timestamp={createdAt} />
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
								<Timestamp timestamp={closedAt} />
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
								<Timestamp timestamp={deletedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const promptTurnsResource = selection.$$promptTurns}
		<ResourceBoundary
			resource={promptTurnsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AcpPromptTurnsView
						selection={promptTurnsResource}
						countResource={promptTurnsResource.count}
						title='prompt turns'
						id='prompt-turns'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
