<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { xmtpConversationConsentStateByConsentState } from '$/constants/Social/Xmtp.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(
			'/(social)/(xmtp)/xmtp/(conversations)/conversation/[conversationId]',
			{ conversationId: selection.entitySelector.id },
		),
		title: titleProp,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.XmtpConversation>
			href?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const conversation = $derived(selection( { sources: [
				Source.Local_Internal,
			], fields: { peerInboxId: true, topic: true, createdAtMs: true, consentState: true } }))


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpConversation}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	title={titleProp ?? 'Conversation'}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selection.entitySelector.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={conversation}
			placeholderText="Loading conversation…"
		>
			{#snippet children(conversation)}
				{#if conversation.topic != null && conversation.topic !== ''}
					<TruncatedValue
						value={conversation.topic}
						format={TruncatedValueFormat.Visual}
					/>
				{:else if conversation.peerInboxId != null && conversation.peerInboxId !== ''}
					<TruncatedValue
						value={conversation.peerInboxId}
						format={TruncatedValueFormat.Visual}
					/>
				{:else}
					<TruncatedValue
						value={selection.entitySelector.id}
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
							{#if conversation.consentState !== undefined}
								{xmtpConversationConsentStateByConsentState[conversation.consentState].label}
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
								{#if conversation.peerInboxId != null && conversation.peerInboxId !== ''}
									<TruncatedValue
										value={conversation.peerInboxId}
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
								{#if conversation.topic != null && conversation.topic !== ''}
									<TruncatedValue
										value={conversation.topic}
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
								{#if conversation.createdAtMs !== undefined}
									<Timestamp
										timestamp={conversation.createdAtMs}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}
</EntityView>
