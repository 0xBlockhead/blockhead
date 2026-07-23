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
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AcpAgentRuntime>
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
	const acpAgentRuntime = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			transportKind: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			transportKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.runtimeId) ?? '')].filter(Boolean).join(' ') || 'ACP agent runtime')
	const viewDomId = $derived('acp-agent-runtime-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		<ResourceBoundary resource={acpAgentRuntime}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.runtimeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpAgentRuntime}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$programVersion}
				>
					{#snippet children(acpAgentProgramVersion)}
						{#if acpAgentProgramVersion != null && acpAgentProgramVersion[EntityMetaKey.Selector] != null}
							<AcpAgentProgramVersionView
								selection={select(EntityType.AcpAgentProgramVersion, acpAgentProgramVersion[EntityMetaKey.Selector])}
								prefetched={acpAgentProgramVersion}
								href=""
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
										(
											blockheadSource[EntityMetaKey.Selector] != null && 'id' in blockheadSource[EntityMetaKey.Selector]
											&& blockheadSource[EntityMetaKey.Selector].id != null ?
												resolve('/~/manage/source/[sourceId=stringSegment]', {
											sourceId: String(blockheadSource[EntityMetaKey.Selector].id ?? ''),
										})
										:
												undefined
										)
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
		{@const acpAgentRuntimeAcpSessionsViewSessionsResource = selection.$$sessions}
		<ResourceBoundary
			resource={acpAgentRuntimeAcpSessionsViewSessionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<AcpSessionsView
					selection={acpAgentRuntimeAcpSessionsViewSessionsResource}
					countResource={acpAgentRuntimeAcpSessionsViewSessionsResource.count}
					title='sessions'
					id='AcpSessionsView-sessions'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const acpAgentRuntimeAcpAgentRuntimeTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={acpAgentRuntimeAcpAgentRuntimeTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<AcpAgentRuntime_TimestampsView
					selection={acpAgentRuntimeAcpAgentRuntimeTimestampsViewTimestampsResource}
					countResource={acpAgentRuntimeAcpAgentRuntimeTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='AcpAgentRuntime_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
