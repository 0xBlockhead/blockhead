<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		open = $bindable(true),
		title = 'Conversations',
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
			open?: boolean
			title?: string
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()



	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import XmtpConversationView from '$/views/XmtpConversationView.svelte'
</script>

<ResourceBoundary resource={selection({

	})}>
	{#snippet children(conversations)}
		<EntitiesList
			{...EntitiesListProps}
			bind:open
			entityType={EntityType.XmtpConversation}
			{title}
			{id}
			href={href}
			items={conversations.entities}
			getKey={(conversation) => stringify(conversation.entitySelector)}
		>
			{#snippet TypeAnnotationTooltip()}
				<p>
					XMTP conversations are local messaging threads, not public social feeds or blockchain transactions.
				</p>
			{/snippet}

			{#snippet Item({ item })}
				<XmtpConversationView
					selector={item.entitySelector}
					layout={EntityLayout.Summary}

					showTypeAnnotation={false}
				/>
			{/snippet}
		</EntitiesList>
	{/snippet}
</ResourceBoundary>
