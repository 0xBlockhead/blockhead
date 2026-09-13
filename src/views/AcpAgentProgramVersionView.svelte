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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AcpAgentProgramVersion> = $props()

	const artifact = $derived(selection.entitySelector.$artifact)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.AcpRegistry_Rest,
		],
	}))
	const acpAgentProgramVersion = $derived(viewSelection({
		fields: {
			version: true,
			distributionKind: true,
		},
	}))
	const titleFallback = $derived((prefetched.version ?? '') || 'ACP agent program version')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
	import AcpAgentProgramView from '$/views/AcpAgentProgramView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpAgentProgramVersion}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				selection.entitySelector.version !== undefined
				&& selection.entitySelector.$program !== undefined
				&& selection.entitySelector.$program.registryAgentId !== undefined ?
					resolve(
						'/(agents)/agents/acp/program/registry/[registryAgentId=stringSegment]/(acpAgentProgram)/version/[version=stringSegment]',
						{
							registryAgentId: selection.entitySelector.$program.registryAgentId,
							version: selection.entitySelector.version,
						}
					)
				:
					artifact !== undefined
					&& artifact.digestAlgorithm !== undefined
					&& artifact.digest !== undefined ?
						resolve(
							'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/acp-program-version',
							{
								digestAlgorithm: artifact.digestAlgorithm,
								digest: artifact.digest,
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={acpAgentProgramVersion}>
			{#snippet children(entity)}
				{(entity.version ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$program}
		>
			{#snippet children(acpAgentProgram)}
				{#if acpAgentProgram != null}
					{@const acpAgentProgramInitial = untrack(() => acpAgentProgram)}
					<AcpAgentProgramView
						selection={select(EntityType.AcpAgentProgram, (acpAgentProgram ?? acpAgentProgramInitial)[EntityMetaKey.Selector])}
						prefetched={acpAgentProgram ?? acpAgentProgramInitial}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpAgentProgramVersion}>
			{#snippet children(entity)}
				{@const distributionKind = entity.distributionKind}
				{#if distributionKind != null}
					<span data-text="muted">
						{distributionKind}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$program}
			>
				{#snippet children(acpAgentProgram)}
					{#if acpAgentProgram != null}
						{@const acpAgentProgramInitial = untrack(() => acpAgentProgram)}
						<div>
							<dt>program</dt>
							<dd>
								<AcpAgentProgramView
									selection={select(EntityType.AcpAgentProgram, (acpAgentProgram ?? acpAgentProgramInitial)[EntityMetaKey.Selector])}
									prefetched={acpAgentProgram ?? acpAgentProgramInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={acpAgentProgramVersion}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>version</dt>
							<dd>
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$artifact}
			>
				{#snippet children(aiArtifact)}
					{#if aiArtifact != null}
						{@const aiArtifactInitial = untrack(() => aiArtifact)}
						<div>
							<dt>artifact</dt>
							<dd>
								<AiArtifactView
									selection={select(EntityType.AiArtifact, (aiArtifact ?? aiArtifactInitial)[EntityMetaKey.Selector])}
									prefetched={aiArtifact ?? aiArtifactInitial}
									layout={EntityLayout.Value}
								/>
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
							releaseDate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const releaseDate = entity.releaseDate}
					{#if releaseDate != null}
						<div>
							<dt>release date</dt>
							<dd>
								<Timestamp timestamp={releaseDate} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={acpAgentProgramVersion}
			>
				{#snippet children(entity)}
					{@const distributionKind = entity.distributionKind}
					{#if distributionKind != null}
						<div>
							<dt>distribution kind</dt>
							<dd>
								{distributionKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							command: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const command = entity.command}
					{#if command != null}
						<div>
							<dt>command</dt>
							<dd>
								{command}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const documentsResource = selection.$$documents}
		<ResourceBoundary
			resource={documentsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AiDocumentsView
						selection={documentsResource}
						countResource={documentsResource.count}
						title='documents'
						id='documents'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
