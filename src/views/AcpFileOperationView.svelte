<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AcpFileOperation>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.AcpLocal_JsonRpc,
		],
	}))
	const acpFileOperation = $derived(viewSelection({
		fields: {
			operationKind: true,
			path: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.operationId || 'ACP file operation')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpFileOperation}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/file-operation/[operationId=stringSegment]',
				{
					sessionId: selection.entitySelector.$session.sessionId,
					operationId: selection.entitySelector.operationId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={acpFileOperation}>
			{#snippet children(entity)}
				{entity.operationKind || selection.entitySelector.operationId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpFileOperation}>
			{#snippet children(entity)}
				{@const path = entity.path}
				{#if path != null}
					<span data-text="muted">
						{path}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>session</dt>
				<dd>
					<AcpSessionView
						selection={select(EntityType.AcpSession, selection.entitySelector.$session)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>operation ID</dt>
				<dd>
					{selection.entitySelector.operationId}
				</dd>
			</div>

			<div>
				<dt>operation kind</dt>
				<dd>
					<ResourceBoundary
						resource={acpFileOperation}
					>
						{#snippet children(entity)}
							{entity.operationKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={acpFileOperation}
			>
				{#snippet children(entity)}
					{@const path = entity.path}
					{#if path != null}
						<div>
							<dt>path</dt>
							<dd>
								{path}
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
							startLine: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const startLine = entity.startLine}
					{#if startLine != null}
						<div>
							<dt>start line</dt>
							<dd>
								<NumberValue
									value={startLine}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							endLine: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const endLine = entity.endLine}
					{#if endLine != null}
						<div>
							<dt>end line</dt>
							<dd>
								<NumberValue
									value={endLine}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							contentHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contentHashAlgorithm = entity.contentHashAlgorithm}
					{#if contentHashAlgorithm != null}
						<div>
							<dt>content hash algorithm</dt>
							<dd>
								{contentHashAlgorithm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							contentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contentHash = entity.contentHash}
					{#if contentHash != null}
						<div>
							<dt>content hash</dt>
							<dd>
								<TruncatedValue value={contentHash} />
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
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
