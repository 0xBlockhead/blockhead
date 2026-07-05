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
			selection: EntityProxyResource<typeof schema, EntityType.XmtpConversation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.XmtpConversation>>
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
	const xmtpConversation = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			peerInboxId: true,
			topic: true,
			createdAtMs: true,
			consentState: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.topic) ?? ''), String((prefetched.peerInboxId) ?? ''), String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || 'XMTP conversation')
	const viewDomId = $derived('xmtp-conversation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpConversation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xmtpConversation}>
			{#snippet Pending()}
				{[String((prefetched.topic) ?? ''), String((prefetched.peerInboxId) ?? ''), String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || title || 'XMTP conversation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.topic) ?? ''), String((resolvedEntity.peerInboxId) ?? ''), String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={xmtpConversation}>
			{#snippet Pending()}
				{@const id0 = selection.entitySelector.id ?? prefetched.id}
				{#if id0 !== undefined && id0 !== null}
					<TruncatedValue value={String((id0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const id0 = resolvedEntity.id}
				{#if id0 !== undefined && id0 !== null}
					<TruncatedValue value={String((id0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={xmtpConversation}>
			{#snippet Pending()}
				{@const createdAtMs0 = prefetched.createdAtMs}
				{#if createdAtMs0 !== undefined && createdAtMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAtMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const createdAtMs0 = resolvedEntity.createdAtMs}
				{#if createdAtMs0 !== undefined && createdAtMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAtMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							consentState: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const consentState = prefetched.consentState}
					{#if consentState !== undefined && consentState !== null}
						<div>
							<dt>Consent</dt>
							<dd>
								{String((consentState) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const consentState = resolvedEntity.consentState}
					{#if consentState !== undefined && consentState !== null}
						<div>
							<dt>Consent</dt>
							<dd>
								{String((consentState) ?? '')}
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
							peerInboxId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const peerInboxId = prefetched.peerInboxId}
					{#if peerInboxId !== undefined && peerInboxId !== null}
						<div>
							<dt>Peer inbox ID</dt>
							<dd>
								<TruncatedValue value={String((peerInboxId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const peerInboxId = resolvedEntity.peerInboxId}
					{#if peerInboxId !== undefined && peerInboxId !== null}
						<div>
							<dt>Peer inbox ID</dt>
							<dd>
								<TruncatedValue value={String((peerInboxId) ?? '')} />
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
							topic: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const topic = prefetched.topic}
					{#if topic !== undefined && topic !== null}
						<div>
							<dt>Topic</dt>
							<dd>
								<TruncatedValue value={String((topic) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const topic = resolvedEntity.topic}
					{#if topic !== undefined && topic !== null}
						<div>
							<dt>Topic</dt>
							<dd>
								<TruncatedValue value={String((topic) ?? '')} />
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
							createdAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdAtMs = prefetched.createdAtMs}
					{#if createdAtMs !== undefined && createdAtMs !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAtMs = resolvedEntity.createdAtMs}
					{#if createdAtMs !== undefined && createdAtMs !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const id = selection.entitySelector.id ?? prefetched.id}
							{#if id !== undefined && id !== null}
								<TruncatedValue value={String((id) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								<TruncatedValue value={String((id) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
