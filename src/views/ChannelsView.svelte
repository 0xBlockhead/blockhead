<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		title = 'Channels',
		open = $bindable(true),
		href,
		id,
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.StateChannel>
			title?: string
			open?: boolean
			href: string
			id: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			| 'entityType'
			| 'getKey'
			| 'getSortValue'
			| 'items'
			| 'resource'
			| 'Item'
			| 'body'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			open ?
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				}
			:
				{}
		),
	)

	const channels = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.StateChannel>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
				.toSorted((a, b) => (
					a[EntityMetaKey.Id].id.localeCompare(b[EntityMetaKey.Id].id)
				))
			return (
				rows.map((value) => ({
					value,
				}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ChannelView from '$/views/ChannelView.svelte'
</script>


	<EntitiesList
		entityType={EntityType.StateChannel}
		{href}
		{id}
		{title}
		bind:open
		getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
		getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
		placeholderKeys={new SvelteSet()}
		placeholderText="Loading channels…"
		resource={channels}
		UnorderedListProps={{ orientation: ListOrientation.Column }}
		{...entitiesListProps}
	>
		{#snippet TypeAnnotationTooltip()}
			<p>
				State channels move balances or assets under agreed rules before final settlement on-chain.
			</p>
			<p>
				Shared contacts and collaboration rooms are separate lists.
			</p>
		{/snippet}
		{#snippet Empty()}
			<p data-text="muted">
				No channels yet.
			</p>
		{/snippet}

		{#snippet Item({ item })}
			{#if item}
				{@const channelId = item.value[EntityMetaKey.Id]}
				<ChannelView
					entityId={channelId}
					href={resolve('/(assets)/(channels)/channel/[channelId]', {
						channelId: channelId.id,
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/snippet}
	</EntitiesList>


