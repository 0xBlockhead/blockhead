<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentProgramInstall>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadAgentProgramInstall>>
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
	const blockheadAgentProgramInstall = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			command: true,
			updatedAt: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.installId ?? prefetched.installId) ?? '')].filter(Boolean).join(' ') || 'blockhead agent program install')
	const viewDomId = $derived('blockhead-agent-program-install-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadAgentProgramInstall_TimestampsView from '$/views/BlockheadAgentProgramInstall_TimestampsView.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentProgramInstall}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadAgentProgramInstall}>
			{#snippet Pending()}
				{[String((selection.entitySelector.installId ?? prefetched.installId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead agent program install'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.installId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAgentProgramInstall}>
			{#snippet Pending()}
				{[String((prefetched.command) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.installId ?? prefetched.installId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead agent program install'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.command) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.installId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAgentProgramInstall}>
			{#snippet Pending()}
				{@const updatedAt0 = prefetched.updatedAt}
				{#if updatedAt0 !== undefined && updatedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(updatedAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const updatedAt0 = resolvedEntity.updatedAt}
				{#if updatedAt0 !== undefined && updatedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(updatedAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>install ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									installId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const installId = selection.entitySelector.installId ?? prefetched.installId}
							{#if installId !== undefined && installId !== null}
								{String((installId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const installId = resolvedEntity.installId}
							{#if installId !== undefined && installId !== null}
								{String((installId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BlockheadSource, false>('$source')}
			>
				{#snippet children(blockheadSource)}
					{#if blockheadSource != null && blockheadSource[EntityMetaKey.Selector] != null}
						<div>
							<dt>Source</dt>
							<dd>
								<BlockheadSourceView
									selection={select(EntityType.BlockheadSource, blockheadSource[EntityMetaKey.Selector])}
									prefetched={blockheadSource}
									layout={EntityLayout.Title}
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
						fields: {
							installPath: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const installPath = prefetched.installPath}
					{#if installPath !== undefined && installPath !== null}
						<div>
							<dt>install path</dt>
							<dd>
								{String((installPath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const installPath = resolvedEntity.installPath}
					{#if installPath !== undefined && installPath !== null}
						<div>
							<dt>install path</dt>
							<dd>
								{String((installPath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							command: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const command = prefetched.command}
					{#if command !== undefined && command !== null}
						<div>
							<dt>command</dt>
							<dd>
								{String((command) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							argsHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const argsHashAlgorithm = prefetched.argsHashAlgorithm}
					{#if argsHashAlgorithm !== undefined && argsHashAlgorithm !== null}
						<div>
							<dt>args hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((argsHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const argsHashAlgorithm = resolvedEntity.argsHashAlgorithm}
					{#if argsHashAlgorithm !== undefined && argsHashAlgorithm !== null}
						<div>
							<dt>args hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((argsHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							argsHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const argsHash = prefetched.argsHash}
					{#if argsHash !== undefined && argsHash !== null}
						<div>
							<dt>args hash</dt>
							<dd>
								<TruncatedValue value={String((argsHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const argsHash = resolvedEntity.argsHash}
					{#if argsHash !== undefined && argsHash !== null}
						<div>
							<dt>args hash</dt>
							<dd>
								<TruncatedValue value={String((argsHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							environmentScope: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const environmentScope = prefetched.environmentScope}
					{#if environmentScope !== undefined && environmentScope !== null}
						<div>
							<dt>environment scope</dt>
							<dd>
								{String((environmentScope) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const environmentScope = resolvedEntity.environmentScope}
					{#if environmentScope !== undefined && environmentScope !== null}
						<div>
							<dt>environment scope</dt>
							<dd>
								{String((environmentScope) ?? '')}
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
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdAt = prefetched.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
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
					selection({
						fields: {
							updatedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const updatedAt = prefetched.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt = resolvedEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadAgentProgramInstall_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadAgentProgramInstall_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No install observations.'
				id='BlockheadAgentProgramInstall_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
