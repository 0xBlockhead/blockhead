<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.XmtpConversation>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import XmtpConversationView from '$/views/XmtpConversationView.svelte'
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
		{@const selection = select(EntityType.XmtpConversation, xmtpConversation[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const xmtpConversationHrefFields = { ...xmtpConversation, ...xmtpConversation[EntityMetaKey.Selector] }}
		<XmtpConversationView
			selection={selection}
			prefetched={xmtpConversationFields}
			href={
				(xmtpConversationHrefFields.id !== undefined ? resolve('/xmtp/conversation/[conversationId=stringSegment]', {
					conversationId: String(xmtpConversationHrefFields.id ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
