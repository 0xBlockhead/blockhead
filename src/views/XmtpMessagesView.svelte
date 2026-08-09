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
	}: EntityListViewProps<EntityType.XmtpMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XmtpMessage}
	bind:open
	resource={
		selection({
			...{
				fields: {
					contentText: true,
					id: true,
					senderInboxId: true,
					sentAtNs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: xmtpMessage })}
		{@const xmtpMessageSelector = xmtpMessage[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XmtpMessage}
			entitySelector={xmtpMessageSelector}
			href={
				'$conversation' in xmtpMessageSelector ?
					resolve(
						'/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]/(xmtpConversation)/message/[messageId=stringSegment]',
						{
							conversationId: xmtpMessageSelector.$conversation.id,
							messageId: xmtpMessageSelector.id,
						}
					)
				:
					resolve(
						'/xmtp/message/[id=stringSegment]',
						{
							id: xmtpMessageSelector.id,
						}
					)
			}
		>
			{#snippet Title()}
				{[(xmtpMessage.contentText ?? ''), xmtpMessageSelector.id].filter(Boolean).join(' ') || 'XMTP message'}
			{/snippet}

			{#snippet Value()}
				{xmtpMessage.senderInboxId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{xmtpMessage.sentAtNs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
