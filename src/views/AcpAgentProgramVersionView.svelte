<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
			selection: RegisteredEntityProxyResource<EntityType.AcpAgentProgramVersion>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AcpAgentProgramVersion>>
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
	const acpAgentProgramVersion = $derived(selection({
		sources: selection.sources,
		fields: {
			distributionKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.version) ?? '')].filter(Boolean).join(' ') || 'ACP agent program version')
	const viewDomId = $derived('acp-agent-program-version-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
	import AcpAgentProgramView from '$/views/AcpAgentProgramView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpAgentProgramVersion}
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
			{[String((pendingEntity.version) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={acpAgentProgramVersion}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.version) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={selection.$program}
					>
						{#snippet children(acpAgentProgram)}
							{#if acpAgentProgram != null && acpAgentProgram[EntityMetaKey.Selector] != null}
								<AcpAgentProgramView
									selection={select(EntityType.AcpAgentProgram, acpAgentProgram[EntityMetaKey.Selector])}
									prefetched={acpAgentProgram}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={acpAgentProgramVersion}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$program}
					>
						{#snippet children(acpAgentProgram)}
							{#if acpAgentProgram != null && acpAgentProgram[EntityMetaKey.Selector] != null}
								<AcpAgentProgramView
									selection={select(EntityType.AcpAgentProgram, acpAgentProgram[EntityMetaKey.Selector])}
									prefetched={acpAgentProgram}
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
			{@const distributionKind0 = pendingEntity.distributionKind}
			{#if distributionKind0 !== undefined && distributionKind0 !== null}
				<span data-text="muted">
					{String((distributionKind0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={acpAgentProgramVersion}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const distributionKind0 = resolvedEntity.distributionKind}
					{#if distributionKind0 !== undefined && distributionKind0 !== null}
						<span data-text="muted">
							{String((distributionKind0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$program}
			>
				{#snippet children(acpAgentProgram)}
					{#if acpAgentProgram != null && acpAgentProgram[EntityMetaKey.Selector] != null}
						<div>
							<dt>program</dt>
							<dd>
								<AcpAgentProgramView
									selection={select(EntityType.AcpAgentProgram, acpAgentProgram[EntityMetaKey.Selector])}
									prefetched={acpAgentProgram}
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
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$artifact}
			>
				{#snippet children(aiArtifact)}
					{#if aiArtifact != null && aiArtifact[EntityMetaKey.Selector] != null}
						<div>
							<dt>artifact</dt>
							<dd>
								<AiArtifactView
									selection={select(EntityType.AiArtifact, aiArtifact[EntityMetaKey.Selector])}
									prefetched={aiArtifact}
									layout={EntityLayout.Value}
									open={false}
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
					selection({
						sources: selection.sources,
						fields: {
							releaseDate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const releaseDate = resolvedEntity.releaseDate}
					{#if releaseDate !== undefined && releaseDate !== null}
						<div>
							<dt>release date</dt>
							<dd>
								<Timestamp timestamp={Number(releaseDate)} />
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
							distributionKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const distributionKind = resolvedEntity.distributionKind}
					{#if distributionKind !== undefined && distributionKind !== null}
						<div>
							<dt>distribution kind</dt>
							<dd>
								{String((distributionKind) ?? '')}
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
							command: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const command = resolvedEntity.command}
					{#if command !== undefined && command !== null}
						<div>
							<dt>command</dt>
							<dd>
								{String((command) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AiDocumentsView
				selection={
						selection.$$documents({
							count: true,
						})
					}
				title='documents'
				emptyText='No linked documents.'
				id='AiDocumentsView-documents'
			/>
		{/if}
	{/snippet}
</EntityView>
