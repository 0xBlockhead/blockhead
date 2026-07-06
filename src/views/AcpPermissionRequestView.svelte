<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpPermissionRequest>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AcpPermissionRequest>>
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
	const acpPermissionRequest = $derived(selection({
		sources: [
			Source.AcpLocal_JsonRpc,
		],
		fields: {
			requestKind: true,
			decision: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.requestId ?? prefetched.requestId) ?? '')].filter(Boolean).join(' ') || 'ACP permission request')
	const viewDomId = $derived('acp-permission-request-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpPermissionRequest}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={acpPermissionRequest}>
			{#snippet Pending()}
				{[String((selection.entitySelector.requestId ?? prefetched.requestId) ?? '')].filter(Boolean).join(' ') || title || 'ACP permission request'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.requestId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpPermissionRequest}>
			{#snippet Pending()}
				{[String((prefetched.requestKind) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.requestId ?? prefetched.requestId) ?? '')].filter(Boolean).join(' ') || title || 'ACP permission request'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.requestKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.requestId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpPermissionRequest}>
			{#snippet Pending()}
				{@const decision0 = prefetched.decision}
				{#if decision0 !== undefined && decision0 !== null}
					<span data-text="muted">
						{String((decision0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const decision0 = resolvedEntity.decision}
				{#if decision0 !== undefined && decision0 !== null}
					<span data-text="muted">
						{String((decision0) ?? '')}
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
						selection={select(EntityType.AcpSession, selection.entitySelector.$session)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>request ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									requestId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const requestId = selection.entitySelector.requestId ?? prefetched.requestId}
							{#if requestId !== undefined && requestId !== null}
								{String((requestId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const requestId = resolvedEntity.requestId}
							{#if requestId !== undefined && requestId !== null}
								{String((requestId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>request kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									requestKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const requestKind = prefetched.requestKind}
							{#if requestKind !== undefined && requestKind !== null}
								{String((requestKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const requestKind = resolvedEntity.requestKind}
							{#if requestKind !== undefined && requestKind !== null}
								{String((requestKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							decision: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const decision = prefetched.decision}
					{#if decision !== undefined && decision !== null}
						<div>
							<dt>decision</dt>
							<dd>
								{String((decision) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decision = resolvedEntity.decision}
					{#if decision !== undefined && decision !== null}
						<div>
							<dt>decision</dt>
							<dd>
								{String((decision) ?? '')}
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
							resolvedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const resolvedAt = prefetched.resolvedAt}
					{#if resolvedAt !== undefined && resolvedAt !== null}
						<div>
							<dt>resolved AT</dt>
							<dd>
								<Timestamp timestamp={Number(resolvedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resolvedAt = resolvedEntity.resolvedAt}
					{#if resolvedAt !== undefined && resolvedAt !== null}
						<div>
							<dt>resolved AT</dt>
							<dd>
								<Timestamp timestamp={Number(resolvedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
