<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import StateChannelView from '$/views/StateChannelView.svelte'


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


	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: [
					Source.Local_Internal,
				],
			},
		},
	)

	const channels = derive(
		parentEntity,
		(merged) => {
			const rows = (
				(
					merged[entityFieldReference.fieldName as keyof typeof merged]
					?? []
				) as Entity<typeof schema, EntityType.StateChannel>[]
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
	{#snippet Empty()}
		<p data-text="muted">
			No state channels yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const channelId = props.item.value[EntityMetaKey.Id]}
			<StateChannelView
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
