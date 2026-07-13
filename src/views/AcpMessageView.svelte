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
			selection: EntityProxyResource<typeof schema, EntityType.AcpMessage>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AcpMessage>>
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
	const acpMessage = $derived(selection({
		sources: [
			Source.AcpLocal_JsonRpc,
		],
		fields: {
			role: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.messageId) ?? '')].filter(Boolean).join(' ') || 'ACP message')
	const viewDomId = $derived('acp-message-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AcpMessagePartsView from '$/views/AcpMessagePartsView.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpMessage}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={acpMessage}>
			{#snippet Pending()}
				{[String((pendingEntity.messageId) ?? '')].filter(Boolean).join(' ') || title || 'ACP message'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.messageId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpMessage}>
			{#snippet Pending()}
				{[String((pendingEntity.role) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.messageId) ?? '')].filter(Boolean).join(' ') || title || 'ACP message'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.role) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.messageId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpMessage}>
			{#snippet Pending()}
				{@const createdAt0 = pendingEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const createdAt0 = resolvedEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
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
				<dt>message ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									messageId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const messageId = pendingEntity.messageId}
							{#if messageId !== undefined && messageId !== null}
								{String((messageId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const messageId = resolvedEntity.messageId}
							{#if messageId !== undefined && messageId !== null}
								{String((messageId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>role</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									role: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const role = pendingEntity.role}
							{#if role !== undefined && role !== null}
								{String((role) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const role = resolvedEntity.role}
							{#if role !== undefined && role !== null}
								{String((role) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
					{@const createdAt = pendingEntity.createdAt}
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AcpMessagePartsView
				selection={
						selection.$$parts({
							count: true,
						})
					}
				title='parts'
				emptyText='No ACP message parts.'
				id='AcpMessagePartsView-parts'
			/>
		{/if}
	{/snippet}
</EntityView>
