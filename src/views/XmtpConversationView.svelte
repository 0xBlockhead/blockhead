<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { xmtpConversationConsentStateByConsentState } from '$/constants/Social/Xmtp.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(social)/(xmtp)/xmtp/(conversations)/conversation/[conversationId]',
			{ conversationId: selector.id },
		),
		title: titleProp,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.XmtpConversation>
			href?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const conversation = $derived(proxy(EntityType.XmtpConversation, selector, ({ sources: [
				Source.Local_Internal,
			], fields: { peerInboxId: true, topic: true, createdAtMs: true, consentState: true } })))


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpConversation}
	entitySelector={selector}
	href={href}
	bind:open
	title={titleProp ?? 'Conversation'}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selector.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={conversation}
			placeholderText="Loading conversation…"
		>
			{#snippet children(conversation)}
				{#if conversation.fields.topic != null && conversation.fields.topic !== ''}
					<TruncatedValue
						value={conversation.fields.topic}
						format={TruncatedValueFormat.Visual}
					/>
				{:else if conversation.fields.peerInboxId != null && conversation.fields.peerInboxId !== ''}
					<TruncatedValue
						value={conversation.fields.peerInboxId}
						format={TruncatedValueFormat.Visual}
					/>
				{:else}
					<TruncatedValue
						value={selector.id}
						format={TruncatedValueFormat.Visual}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Thread id in XMTP labels a double‑ratchet conversation between provisioned wallet identities.
		</p>
		<p>
			Ciphertext and session state live off-chain; explorers cannot reconstruct transcripts from calldata alone.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Consent</dt>
				<dd>
					<ResourceBoundary
						resource={conversation}
						placeholderText="Loading conversation…"
					>
						{#snippet children(conversation)}
							{#if conversation.fields.consentState !== undefined}
								{xmtpConversationConsentStateByConsentState[conversation.fields.consentState].label}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Peer inbox id</dt>
					<dd>
						<ResourceBoundary
							resource={conversation}
							placeholderText="Loading conversation…"
						>
							{#snippet children(conversation)}
								{#if conversation.fields.peerInboxId != null && conversation.fields.peerInboxId !== ''}
									<TruncatedValue
										value={conversation.fields.peerInboxId}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Topic</dt>
					<dd>
						<ResourceBoundary
							resource={conversation}
							placeholderText="Loading conversation…"
						>
							{#snippet children(conversation)}
								{#if conversation.fields.topic != null && conversation.fields.topic !== ''}
									<TruncatedValue
										value={conversation.fields.topic}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Created</dt>
					<dd>
						<ResourceBoundary
							resource={conversation}
							placeholderText="Loading conversation…"
						>
							{#snippet children(conversation)}
								{#if conversation.fields.createdAtMs !== undefined}
									<Timestamp
										timestamp={conversation.fields.createdAtMs}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
	{/snippet}
</EntityView>
