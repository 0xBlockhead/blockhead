<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Conversations',
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.XmtpConversation>
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import XmtpConversationView from '$/views/XmtpConversationView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.XmtpConversation}
	{title}
>
	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
		entityFieldReference.selector,({ sources: [Source.Local_Internal], fields: { [entityFieldReference.fieldName]: {},
		} }),
	)}
			{@const conversations = derive(
		parent,
		(parent) => {
			const xmtpConversations: readonly Entity<typeof schema, EntityType.XmtpConversation>[] = (
				parent.fields[entityFieldReference.fieldName]?.values ?? []
			)
			return (
				xmtpConversations
					.map((value) => ({
						value,
					}))
			)
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.XmtpConversation}
				id={`${id}-items`}
				href={href}
				{title}
				getKey={(row) => stringify(row.value[EntityMetaKey.Selector])}
				getSortValue={(row) => row.value[EntityMetaKey.Selector].id}
				resource={conversations}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
						<div data-row="wrap align-center gap-2">
							<p data-text="muted">
								No XMTP inbox threads synced yet.
							</p>
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
									<p>
										Threads sync after an XMTP-capable client merges your local inbox.
									</p>
									<p>
										They are not public timelines or on-chain market tables.
									</p>
								{/snippet}
								<abbr
									class="entity-heading-tip"
									aria-label="How XMTP xmtpConversations appear"
								>ⓘ</abbr>
							</Tooltip>
						</div>
					{/snippet}

				{#snippet Item({ item })}
						<XmtpConversationView
							selector={item.value[EntityMetaKey.Selector]}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}

			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
