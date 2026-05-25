<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { xmtpConversationConsentStates } from '$/constants/Social/Xmtp.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve(
			'/(social)/(xmtp)/xmtp/(conversations)/conversation/[conversationId]',
			{ conversationId: entityId.id },
		),
		title: titleProp,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.XmtpConversation>
			href?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const conversation = useEntity(
		EntityType.XmtpConversation,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			peerInboxId: {},
			topic: {},
			createdAtMs: {},
			consentState: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpConversation}
	{entityId}
	href={href}
	bind:open
	title={titleProp ?? 'Conversation'}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={conversation}
			placeholderText="Loading conversation…"
		>
			{#snippet children(loadedConversation)}
				{#if loadedConversation.topic != null && loadedConversation.topic !== ''}
					<TruncatedValue
						value={loadedConversation.topic}
						format={TruncatedValueFormat.Visual}
					/>
				{:else if loadedConversation.peerInboxId != null && loadedConversation.peerInboxId !== ''}
					<TruncatedValue
						value={loadedConversation.peerInboxId}
						format={TruncatedValueFormat.Visual}
					/>
				{:else}
					{@render Title()}
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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Consent</dt>
				<dd>
					<ResourceBoundary
						resource={conversation}
						placeholderText="Loading conversation…"
					>
						{#snippet children(loadedConversation)}
							{#if loadedConversation.consentState !== undefined}
								{xmtpConversationConsentStates[loadedConversation.consentState].label}
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
							{#snippet children(loadedConversation)}
								{#if loadedConversation.peerInboxId != null && loadedConversation.peerInboxId !== ''}
									<TruncatedValue
										value={loadedConversation.peerInboxId}
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
							{#snippet children(loadedConversation)}
								{#if loadedConversation.topic != null && loadedConversation.topic !== ''}
									<TruncatedValue
										value={loadedConversation.topic}
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
							{#snippet children(loadedConversation)}
								{#if loadedConversation.createdAtMs !== undefined}
									<Timestamp
										timestamp={loadedConversation.createdAtMs}
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
		<EntityDetails
			entityType={EntityType.XmtpConversation}
			{entityId}
		/>
	{/snippet}
</EntityView>
