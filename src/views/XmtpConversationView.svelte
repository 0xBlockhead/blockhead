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
			selection: RegisteredEntityProxyResource<EntityType.XmtpConversation>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.XmtpConversation>
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
	const xmtpConversation = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			peerInboxId: true,
			topic: true,
			createdAtMs: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			peerInboxId: true,
			topic: true,
			createdAtMs: true,
			consentState: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.topic) ?? ''), String((pendingEntity.peerInboxId) ?? ''), String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'XMTP conversation')
	const viewDomId = $derived('xmtp-conversation-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	href={
		href ?? (
			selection.entitySelector != null && 'id' in selection.entitySelector
			&& selection.entitySelector.id != null ?
				resolve('/xmtp/conversation/[conversationId=stringSegment]', {
			conversationId: String(selection.entitySelector.id ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'topic') && Object.hasOwn(prefetched, 'peerInboxId') && Object.hasOwn(prefetched, 'createdAtMs')}
			{[String((pendingEntity.topic) ?? ''), String((pendingEntity.peerInboxId) ?? ''), String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={xmtpConversation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.topic) ?? ''), String((resolvedEntity.peerInboxId) ?? ''), String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'topic') && Object.hasOwn(prefetched, 'peerInboxId') && Object.hasOwn(prefetched, 'createdAtMs')}
			{@const id0 = pendingEntity.id}
			{#if id0 !== undefined && id0 !== null}
				<TruncatedValue value={String((id0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={xmtpConversation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const id0 = resolvedEntity.id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String((id0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'topic') && Object.hasOwn(prefetched, 'peerInboxId') && Object.hasOwn(prefetched, 'createdAtMs')}
			{@const createdAtMs0 = pendingEntity.createdAtMs}
			{#if createdAtMs0 !== undefined && createdAtMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(createdAtMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={xmtpConversation}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							consentState: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							peerInboxId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							topic: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							createdAtMs: true,
						},
					})
				}
			>
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
								sources: selection.sources,
								fields: {
									id: true,
								},
							})
						}
					>
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
