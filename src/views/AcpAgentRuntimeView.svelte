<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.AcpAgentRuntime>, 'prefetched'> = $props()

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
	title={title ?? (selection.entitySelector.runtimeId || 'ACP agent runtime')}
	href={
		href === undefined ?
			resolve(
				'/(agents)/agents/acp/runtime/[runtimeId=stringSegment]',
				{
					runtimeId: selection.entitySelector.runtimeId,
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
		<ResourceBoundary
			resource={selection.$programVersion}
		>
			{#snippet children(acpAgentProgramVersion)}
				{#if acpAgentProgramVersion != null}
					{@const acpAgentProgramVersionInitial = untrack(() => acpAgentProgramVersion)}
					<AcpAgentProgramVersionView
						selection={select(EntityType.AcpAgentProgramVersion, (acpAgentProgramVersion ?? acpAgentProgramVersionInitial)[EntityMetaKey.Selector])}
						prefetched={acpAgentProgramVersion ?? acpAgentProgramVersionInitial}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpAgentRuntime}>
			{#snippet children(entity)}
				{@const transportKind = entity.transportKind}
				{#if transportKind != null}
					<span data-text="muted">
						{transportKind}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>runtime ID</dt>
				<dd>
					{selection.entitySelector.runtimeId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$source}
			>
				{#snippet children(blockheadSource)}
					{#if blockheadSource != null}
						{@const blockheadSourceInitial = untrack(() => blockheadSource)}
						<div>
							<dt>Source</dt>
							<dd>
								<BlockheadSourceView
									selection={select(EntityType.BlockheadSource, (blockheadSource ?? blockheadSourceInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadSource ?? blockheadSourceInitial}
									layout={EntityLayout.Value}
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
						{@const acpAgentProgramVersionInitial = untrack(() => acpAgentProgramVersion)}
						<div>
							<dt>program version</dt>
							<dd>
								<AcpAgentProgramVersionView
									selection={select(EntityType.AcpAgentProgramVersion, (acpAgentProgramVersion ?? acpAgentProgramVersionInitial)[EntityMetaKey.Selector])}
									prefetched={acpAgentProgramVersion ?? acpAgentProgramVersionInitial}
									layout={EntityLayout.Value}
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
						{@const blockheadAgentProgramInstallInitial = untrack(() => blockheadAgentProgramInstall)}
						<div>
							<dt>program install</dt>
							<dd>
								<BlockheadAgentProgramInstallView
									selection={select(EntityType.BlockheadAgentProgramInstall, (blockheadAgentProgramInstall ?? blockheadAgentProgramInstallInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
								<Timestamp timestamp={initializedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const sessionsResource = selection.$$sessions}
		<ResourceBoundary
			resource={sessionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AcpSessionsView
						selection={sessionsResource}
						countResource={sessionsResource.count}
						title='sessions'
						id='sessions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AcpAgentRuntime_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
