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
	}: EntityListViewProps<EntityType.AcpMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpMessage}
	bind:open
	resource={
		selection({
			fields: {
				messageId: true,
				role: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: acpMessage })}
		{@const acpMessageSelector = acpMessage[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpMessage}
			entitySelector={acpMessageSelector}
			href={
				resolve(
					'/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/message/[messageId=stringSegment]',
					{
						sessionId: acpMessageSelector.$session.sessionId,
						messageId: acpMessageSelector.messageId,
					}
				)
			}
		>
			{#snippet Title()}
				{acpMessageSelector.messageId || 'ACP message'}
			{/snippet}

			{#snippet Value()}
				{acpMessage.role}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpMessage.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
