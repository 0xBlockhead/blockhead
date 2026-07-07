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
			selection: EntityProxyResource<typeof schema, EntityType.AcpTerminal>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AcpTerminal>>
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
	const acpTerminal = $derived(selection({
		sources: [
			Source.AcpLocal_JsonRpc,
		],
		fields: {
			command: true,
			cwd: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.terminalId ?? prefetched.terminalId) ?? '')].filter(Boolean).join(' ') || 'ACP terminal')
	const viewDomId = $derived('acp-terminal-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AcpTerminal_TimestampsView from '$/views/AcpTerminal_TimestampsView.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpTerminal}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={acpTerminal}>
			{#snippet Pending()}
				{[String((selection.entitySelector.terminalId ?? prefetched.terminalId) ?? '')].filter(Boolean).join(' ') || title || 'ACP terminal'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.terminalId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpTerminal}>
			{#snippet Pending()}
				{[String((prefetched.command) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.terminalId ?? prefetched.terminalId) ?? '')].filter(Boolean).join(' ') || title || 'ACP terminal'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.command) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.terminalId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpTerminal}>
			{#snippet Pending()}
				{@const cwd0 = prefetched.cwd}
				{#if cwd0 !== undefined && cwd0 !== null}
					<span data-text="muted">
						{String((cwd0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const cwd0 = resolvedEntity.cwd}
				{#if cwd0 !== undefined && cwd0 !== null}
					<span data-text="muted">
						{String((cwd0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session</dt>
				<dd>
					<AcpSessionView
						selection={select(EntityType.AcpSession, selection.entitySelector.$session, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>terminal ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									terminalId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const terminalId = selection.entitySelector.terminalId ?? prefetched.terminalId}
							{#if terminalId !== undefined && terminalId !== null}
								{String((terminalId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const terminalId = resolvedEntity.terminalId}
							{#if terminalId !== undefined && terminalId !== null}
								{String((terminalId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cwd: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cwd = prefetched.cwd}
					{#if cwd !== undefined && cwd !== null}
						<div>
							<dt>cwd</dt>
							<dd>
								{String((cwd) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cwd = resolvedEntity.cwd}
					{#if cwd !== undefined && cwd !== null}
						<div>
							<dt>cwd</dt>
							<dd>
								{String((cwd) ?? '')}
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
							releasedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const releasedAt = prefetched.releasedAt}
					{#if releasedAt !== undefined && releasedAt !== null}
						<div>
							<dt>released AT</dt>
							<dd>
								<Timestamp timestamp={Number(releasedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const releasedAt = resolvedEntity.releasedAt}
					{#if releasedAt !== undefined && releasedAt !== null}
						<div>
							<dt>released AT</dt>
							<dd>
								<Timestamp timestamp={Number(releasedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AcpTerminal_TimestampsView
				selection={selection[EntityProxyField]<EntityType.AcpTerminal_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No ACP terminal observations.'
				id='AcpTerminal_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
