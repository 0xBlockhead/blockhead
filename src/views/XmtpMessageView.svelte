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
	}: EntitySelectionViewProps<EntityType.XmtpMessage> = $props()

	const xmtpMessage = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
		fields: {
			senderInboxId: true,
			sentAtNs: true,
			contentText: true,
		},
	}))
	const titleFallback = $derived([(prefetched.contentText ?? ''), selection.entitySelector.id].filter(Boolean).join(' ') || 'XMTP message')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import XmtpConversationView from '$/views/XmtpConversationView.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpMessage}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'$conversation' in selection.entitySelector ?
					resolve(
						'/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]/(xmtpConversation)/message/[messageId=stringSegment]',
						{
							conversationId: selection.entitySelector.$conversation.id,
							messageId: selection.entitySelector.id,
						}
					)
				:
					resolve(
						'/xmtp/message/[id=stringSegment]',
						{
							id: selection.entitySelector.id,
						}
					)
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xmtpMessage}>
			{#snippet children(entity)}
				{[(entity.contentText ?? ''), selection.entitySelector.id].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={xmtpMessage}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.senderInboxId} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={xmtpMessage}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.sentAtNs}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Conversation</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$conversation}
					>
						{#snippet children(xmtpConversation)}
							{@const xmtpConversationInitial = untrack(() => xmtpConversation)}
							<XmtpConversationView
								selection={select(EntityType.XmtpConversation, (xmtpConversation ?? xmtpConversationInitial)[EntityMetaKey.Selector])}
								prefetched={xmtpConversation ?? xmtpConversationInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Sender inbox ID</dt>
				<dd>
					<ResourceBoundary
						resource={xmtpMessage}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.senderInboxId} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Sent at (ns)</dt>
				<dd>
					<ResourceBoundary
						resource={xmtpMessage}
					>
						{#snippet children(entity)}
							{entity.sentAtNs}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.id} />
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={xmtpMessage}
		>
			{#snippet children(entity)}
				{@const contentText = entity.contentText}
				{#if contentText != null && contentText !== ''}
					<p data-text="long-text">{contentText}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
