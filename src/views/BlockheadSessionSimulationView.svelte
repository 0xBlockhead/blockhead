<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadSessionSimulation>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadSessionSimulation>
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
	const blockheadSessionSimulation = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			status: true,
			createdAt: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			status: true,
			createdAt: true,
			paramsHash: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.status) ?? '')].filter(Boolean).join(' ') || 'blockhead session simulation')
	const viewDomId = $derived('blockhead-session-simulation-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSessionSimulationCallsView from '$/views/BlockheadSessionSimulationCallsView.svelte'
	import BlockheadSessionSimulationLogsView from '$/views/BlockheadSessionSimulationLogsView.svelte'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSessionSimulation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status') && Object.hasOwn(prefetched, 'createdAt') && Object.hasOwn(prefetched, '$session') && prefetched.$session != null && prefetched.$session[EntityMetaKey.Selector] != null && Object.hasOwn(prefetched.$session, 'name') && Object.hasOwn(prefetched.$session, 'status') && Object.hasOwn(prefetched.$session, 'updatedAt')}
			{[String((pendingEntity.status) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadSessionSimulation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status') && Object.hasOwn(prefetched, 'createdAt') && Object.hasOwn(prefetched, '$session') && prefetched.$session != null && prefetched.$session[EntityMetaKey.Selector] != null && Object.hasOwn(prefetched.$session, 'name') && Object.hasOwn(prefetched.$session, 'status') && Object.hasOwn(prefetched.$session, 'updatedAt')}
			{@const createdAt0 = pendingEntity.createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<Timestamp timestamp={Number(createdAt0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadSessionSimulation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt0 = resolvedEntity.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<Timestamp timestamp={Number(createdAt0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status') && Object.hasOwn(prefetched, 'createdAt') && Object.hasOwn(prefetched, '$session') && prefetched.$session != null && prefetched.$session[EntityMetaKey.Selector] != null && Object.hasOwn(prefetched.$session, 'name') && Object.hasOwn(prefetched.$session, 'status') && Object.hasOwn(prefetched.$session, 'updatedAt')}
			{@const blockheadSession0 = pendingEntity.$session}
			{#if blockheadSession0 != null && blockheadSession0[EntityMetaKey.Selector] != null}
				<span data-text="muted">
					<BlockheadSessionView
						selection={select(EntityType.BlockheadSession, blockheadSession0[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadSession0}
						href={
							(
								blockheadSession0[EntityMetaKey.Selector] != null && 'id' in blockheadSession0[EntityMetaKey.Selector]
								&& blockheadSession0[EntityMetaKey.Selector].id != null ?
									resolve('/~/session/[sessionId=stringSegment]', {
								sessionId: String(blockheadSession0[EntityMetaKey.Selector].id ?? ''),
							})
							:
									undefined
							)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadSessionSimulation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$session}
					>
						{#snippet children(blockheadSession)}
							{#if blockheadSession != null && blockheadSession[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<BlockheadSessionView
									selection={select(EntityType.BlockheadSession, blockheadSession[EntityMetaKey.Selector])}
									prefetched={blockheadSession}
									href={
										(
											blockheadSession[EntityMetaKey.Selector] != null && 'id' in blockheadSession[EntityMetaKey.Selector]
											&& blockheadSession[EntityMetaKey.Selector].id != null ?
												resolve('/~/session/[sessionId=stringSegment]', {
											sessionId: String(blockheadSession[EntityMetaKey.Selector].id ?? ''),
										})
										:
												undefined
										)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$session}
					>
						{#snippet children(blockheadSession)}
							{#if blockheadSession != null && blockheadSession[EntityMetaKey.Selector] != null}
								<BlockheadSessionView
									selection={select(EntityType.BlockheadSession, blockheadSession[EntityMetaKey.Selector])}
									prefetched={blockheadSession}
									href={
										(
											blockheadSession[EntityMetaKey.Selector] != null && 'id' in blockheadSession[EntityMetaKey.Selector]
											&& blockheadSession[EntityMetaKey.Selector].id != null ?
												resolve('/~/session/[sessionId=stringSegment]', {
											sessionId: String(blockheadSession[EntityMetaKey.Selector].id ?? ''),
										})
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
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
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
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
								<Timestamp timestamp={Number(createdAt)} />
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

			<div>
				<dt>params hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									paramsHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const paramsHash = resolvedEntity.paramsHash}
							{#if paramsHash !== undefined && paramsHash !== null}
								<TruncatedValue value={String((paramsHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							forkBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const forkBlockNumber = resolvedEntity.forkBlockNumber}
					{#if forkBlockNumber !== undefined && forkBlockNumber !== null}
						<div>
							<dt>fork block number</dt>
							<dd>
								<NumberValue
									value={forkBlockNumber}
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
							actionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const actionCount = resolvedEntity.actionCount}
					{#if actionCount !== undefined && actionCount !== null}
						<div>
							<dt>action count</dt>
							<dd>
								<NumberValue
									value={actionCount}
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
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsed = resolvedEntity.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>gas used</dt>
							<dd>
								<NumberValue
									value={gasUsed}
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
							resultPayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resultPayloadHash = resolvedEntity.resultPayloadHash}
					{#if resultPayloadHash !== undefined && resultPayloadHash !== null}
						<div>
							<dt>result payload hash</dt>
							<dd>
								<TruncatedValue value={String((resultPayloadHash) ?? '')} />
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
							error: true,
						},
					})
				}
			>
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

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadSessionSimulationBlockheadSessionSimulationCallsViewCallsResource = selection.$$calls}
		<ResourceBoundary
			resource={blockheadSessionSimulationBlockheadSessionSimulationCallsViewCallsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadSessionSimulationCallsView
					selection={blockheadSessionSimulationBlockheadSessionSimulationCallsViewCallsResource}
					countResource={blockheadSessionSimulationBlockheadSessionSimulationCallsViewCallsResource.count}
					title='calls'
					id='BlockheadSessionSimulationCallsView-calls'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockheadSessionSimulationBlockheadSessionSimulationLogsViewLogsResource = selection.$$logs}
		<ResourceBoundary
			resource={blockheadSessionSimulationBlockheadSessionSimulationLogsViewLogsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadSessionSimulationLogsView
					selection={blockheadSessionSimulationBlockheadSessionSimulationLogsViewLogsResource}
					countResource={blockheadSessionSimulationBlockheadSessionSimulationLogsViewLogsResource.count}
					title='logs'
					id='BlockheadSessionSimulationLogsView-logs'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
