<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntitySelectionViewProps<EntityType.AcpAgentRuntime> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.AcpLocal_JsonRpc,
			Source.Local_Internal,
		],
	}))
	const acpAgentRuntime = $derived(viewSelection({
		fields: {
			transportKind: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.runtimeId ?? '') || 'ACP agent runtime')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.runtimeId ?? '') || 'ACP agent runtime'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$programVersion}
		>
			{#snippet children(acpAgentProgramVersion)}
				{#if acpAgentProgramVersion != null}
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

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpAgentRuntime}>
			{#snippet children(entity)}
				{@const transportKind0 = entity.transportKind}
				{#if transportKind0 != null}
					<span data-text="muted">
						{transportKind0}
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
					{pendingEntity.runtimeId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$source}
			>
				{#snippet children(blockheadSource)}
					{#if blockheadSource != null}
						<div>
							<dt>Source</dt>
							<dd>
								<BlockheadSourceView
									selection={select(EntityType.BlockheadSource, blockheadSource[EntityMetaKey.Selector])}
									prefetched={blockheadSource}
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
					{#if acpAgentProgramVersion != null}
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
					{#if blockheadAgentProgramInstall != null}
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
				resource={acpAgentRuntime}
			>
				{#snippet children(entity)}
					{@const transportKind = entity.transportKind}
					{#if transportKind != null}
						<div>
							<dt>transport kind</dt>
							<dd>
								{transportKind}
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
							processId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const processId = entity.processId}
					{#if processId != null}
						<div>
							<dt>process ID</dt>
							<dd>
								{processId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							initializedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const initializedAt = entity.initializedAt}
					{#if initializedAt != null}
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
						id='sessions'
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
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
