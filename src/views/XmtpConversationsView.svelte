<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'XMTP conversations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XmtpConversations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.XmtpConversation>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XmtpConversation}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				topic: true,
				peerInboxId: true,
				id: true,
				createdAtMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(xmtpConversations) => [...new Map(xmtpConversations.values.map((xmtpConversation) => [xmtpConversation[EntityMetaKey.SelectorKey], xmtpConversation])).values()]}
	getKey={(xmtpConversation) => xmtpConversation[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No XMTP conversations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xmtpConversation })}
		{@const xmtpConversationFields = { ...xmtpConversation[EntityMetaKey.Selector], ...xmtpConversation }}
		<EntityView
			entityType={EntityType.XmtpConversation}
			entitySelector={xmtpConversation[EntityMetaKey.Selector]}
			href={
				(
					xmtpConversation[EntityMetaKey.Selector] != null && 'id' in xmtpConversation[EntityMetaKey.Selector]
					&& xmtpConversation[EntityMetaKey.Selector].id != null ?
						resolve('/xmtp/conversation/[conversationId=stringSegment]', {
					conversationId: String(xmtpConversation[EntityMetaKey.Selector].id ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((xmtpConversationFields.topic) ?? ''), String((xmtpConversationFields.peerInboxId) ?? ''), String((xmtpConversationFields.id) ?? '')].filter(Boolean).join(' ') || 'XMTP conversation'}
			{/snippet}

			{#snippet Value()}
				{[String((xmtpConversationFields.id) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((xmtpConversationFields.createdAtMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
