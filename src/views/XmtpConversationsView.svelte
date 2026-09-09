<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.XmtpConversation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XmtpConversation}
	bind:open
	resource={
		selection({
			fields: {
				topic: true,
				peerInboxId: true,
				id: true,
				createdAtMs: true,
			},
		})
	}
>
	{#snippet Item({ item: xmtpConversation })}
		{@const xmtpConversationSelector = xmtpConversation[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XmtpConversation}
			entitySelector={xmtpConversationSelector}
			href={
				resolve(
					'/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]',
					{
						conversationId: xmtpConversationSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{[(xmtpConversation.topic ?? ''), (xmtpConversation.peerInboxId ?? ''), xmtpConversationSelector.id].filter(Boolean).join(' ') || 'XMTP conversation'}
			{/snippet}

			{#snippet Value()}
				{xmtpConversationSelector.id}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{xmtpConversation.createdAtMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
