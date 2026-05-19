<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Conversations',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.XmtpConversation>
			open?: boolean
			title?: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [Source.Local_Internal],
			[entityFieldReference.fieldName]: {},
		},
	)

	const envelopes = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.XmtpConversation>[] = (
				merged[entityFieldReference.fieldName] ?? []
			)
			return (
				rows
					.toSorted((a, b) => (
						a[EntityMetaKey.Id].id.localeCompare(b[EntityMetaKey.Id].id)
					))
					.map((value) => ({
						value,
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import Tooltip from '$/components/Tooltip.svelte'
	import XmtpConversationView from '$/views/XmtpConversationView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.XmtpConversation}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => row.value[EntityMetaKey.Id].id}
	placeholderKeys={new SvelteSet()}
	resource={envelopes}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
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
					aria-label="How XMTP rows appear"
				>ⓘ</abbr>
			</Tooltip>
		</div>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			<XmtpConversationView
				entityId={props.item.value[EntityMetaKey.Id]}
				href={resolve('/(social)/(xmtp)/xmtp/(conversations)/conversation/[conversationId]', {
					conversationId: props.item.value[EntityMetaKey.Id].id,
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
