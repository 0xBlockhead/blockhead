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
	}: EntityListViewProps<EntityType.XmtpParticipant> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XmtpParticipant}
	bind:open
	resource={
		selection({
			fields: {
				inboxId: true,
			},
		})
	}
>
	{#snippet Item({ item: xmtpParticipant })}
		{@const xmtpParticipantSelector = xmtpParticipant[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XmtpParticipant}
			entitySelector={xmtpParticipantSelector}
			href={
				resolve(
					'/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]/(xmtpConversation)/participant/[inboxId=stringSegment]',
					{
						conversationId: xmtpParticipantSelector.$conversation.id,
						inboxId: xmtpParticipantSelector.inboxId,
					}
				)
			}
		>
			{#snippet Title()}
				{xmtpParticipantSelector.inboxId || 'XMTP participant'}
			{/snippet}

			{#snippet Value()}
				{xmtpParticipantSelector.inboxId}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
