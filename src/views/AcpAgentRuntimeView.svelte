<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AcpAgentRuntime>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AcpAgentRuntime>>
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
	const acpAgentRuntime = $derived(selection({
		sources: selection.sources,
		fields: {
			transportKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.runtimeId) ?? '')].filter(Boolean).join(' ') || 'ACP agent runtime')
	const viewDomId = $derived('acp-agent-runtime-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AcpSessionsView from '$/views/AcpSessionsView.svelte'
	import AcpAgentRuntime_TimestampsView from '$/views/AcpAgentRuntime_TimestampsView.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
	import AcpAgentProgramVersionView from '$/views/AcpAgentProgramVersionView.svelte'
	import BlockheadAgentProgramInstallView from '$/views/BlockheadAgentProgramInstallView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpAgentRuntime}
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
			{[String((pendingEntity.runtimeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={acpAgentRuntime}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.runtimeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={selection.$programVersion}
					>
						{#snippet children(acpAgentProgramVersion)}
							{#if acpAgentProgramVersion != null && acpAgentProgramVersion[EntityMetaKey.Selector] != null}
								<AcpAgentProgramVersionView
									selection={select(EntityType.AcpAgentProgramVersion, acpAgentProgramVersion[EntityMetaKey.Selector])}
									prefetched={acpAgentProgramVersion}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={acpAgentRuntime}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$programVersion}
					>
						{#snippet children(acpAgentProgramVersion)}
							{#if acpAgentProgramVersion != null && acpAgentProgramVersion[EntityMetaKey.Selector] != null}
								<AcpAgentProgramVersionView
									selection={select(EntityType.AcpAgentProgramVersion, acpAgentProgramVersion[EntityMetaKey.Selector])}
									prefetched={acpAgentProgramVersion}
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
			{@const transportKind0 = pendingEntity.transportKind}
			{#if transportKind0 !== undefined && transportKind0 !== null}
				<span data-text="muted">
					{String((transportKind0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={acpAgentRuntime}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transportKind0 = resolvedEntity.transportKind}
					{#if transportKind0 !== undefined && transportKind0 !== null}
						<span data-text="muted">
							{String((transportKind0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>runtime ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									runtimeId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const runtimeId = resolvedEntity.runtimeId}
							{#if runtimeId !== undefined && runtimeId !== null}
								{String((runtimeId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$source}
			>
				{#snippet children(blockheadSource)}
					{#if blockheadSource != null && blockheadSource[EntityMetaKey.Selector] != null}
						<div>
							<dt>Source</dt>
							<dd>
								<BlockheadSourceView
									selection={select(EntityType.BlockheadSource, blockheadSource[EntityMetaKey.Selector])}
									prefetched={blockheadSource}
									href={
										(blockheadSource[EntityMetaKey.Selector].id !== undefined ? resolve('/~/manage/source/[sourceId=stringSegment]', {
											sourceId: String(blockheadSource[EntityMetaKey.Selector].id ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$programVersion}
			>
				{#snippet children(acpAgentProgramVersion)}
					{#if acpAgentProgramVersion != null && acpAgentProgramVersion[EntityMetaKey.Selector] != null}
						<div>
							<dt>program version</dt>
							<dd>
								<AcpAgentProgramVersionView
									selection={select(EntityType.AcpAgentProgramVersion, acpAgentProgramVersion[EntityMetaKey.Selector])}
									prefetched={acpAgentProgramVersion}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$programInstall}
			>
				{#snippet children(blockheadAgentProgramInstall)}
					{#if blockheadAgentProgramInstall != null && blockheadAgentProgramInstall[EntityMetaKey.Selector] != null}
						<div>
							<dt>program install</dt>
							<dd>
								<BlockheadAgentProgramInstallView
									selection={select(EntityType.BlockheadAgentProgramInstall, blockheadAgentProgramInstall[EntityMetaKey.Selector])}
									prefetched={blockheadAgentProgramInstall}
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
							transportKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transportKind = resolvedEntity.transportKind}
					{#if transportKind !== undefined && transportKind !== null}
						<div>
							<dt>transport kind</dt>
							<dd>
								{String((transportKind) ?? '')}
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
							processId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const processId = resolvedEntity.processId}
					{#if processId !== undefined && processId !== null}
						<div>
							<dt>process ID</dt>
							<dd>
								{String((processId) ?? '')}
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
							initializedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const initializedAt = resolvedEntity.initializedAt}
					{#if initializedAt !== undefined && initializedAt !== null}
						<div>
							<dt>initialized AT</dt>
							<dd>
								<Timestamp timestamp={Number(initializedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AcpSessionsView
				selection={
						selection.$$sessions({
							count: true,
						})
					}
				title='sessions'
				emptyText='No ACP sessions.'
				id='AcpSessionsView-sessions'
			/>

			<AcpAgentRuntime_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No ACP runtime observations.'
				id='AcpAgentRuntime_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
