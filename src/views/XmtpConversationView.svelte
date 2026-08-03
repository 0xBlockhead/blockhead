<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.XmtpConversation> = $props()

	const xmtpConversation = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
		fields: {
			peerInboxId: true,
			topic: true,
			createdAtMs: true,
			consentState: true,
		},
	}))
	const titleFallback = $derived([(prefetched.topic ?? ''), (prefetched.peerInboxId ?? ''), selection.entitySelector.id].filter(Boolean).join(' ') || 'XMTP conversation')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpConversation}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]',
				{
					conversationId: selection.entitySelector.id,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xmtpConversation}>
			{#snippet children(entity)}
				{[(entity.topic ?? ''), (entity.peerInboxId ?? ''), selection.entitySelector.id].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.id} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={xmtpConversation}>
			{#snippet children(entity)}
				{@const createdAtMs = entity.createdAtMs}
				{#if createdAtMs != null}
					<span data-text="muted">
						<Timestamp timestamp={createdAtMs} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={xmtpConversation}
			>
				{#snippet children(entity)}
					{@const consentState = entity.consentState}
					{#if consentState != null}
						<div>
							<dt>Consent</dt>
							<dd>
								{consentState}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={xmtpConversation}
			>
				{#snippet children(entity)}
					{@const peerInboxId = entity.peerInboxId}
					{#if peerInboxId != null}
						<div>
							<dt>Peer inbox ID</dt>
							<dd>
								<TruncatedValue value={peerInboxId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={xmtpConversation}
			>
				{#snippet children(entity)}
					{@const topic = entity.topic}
					{#if topic != null}
						<div>
							<dt>Topic</dt>
							<dd>
								<TruncatedValue value={topic} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={xmtpConversation}
			>
				{#snippet children(entity)}
					{@const createdAtMs = entity.createdAtMs}
					{#if createdAtMs != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAtMs} />
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
					<TruncatedValue value={selection.entitySelector.id} />
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
