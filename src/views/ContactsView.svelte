<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	let {
		entityFieldReference,
		title = 'Contacts',
		open = $bindable(true),
		href,
		id,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BlockheadSharedAddress>
			title?: string
			open?: boolean
			href: string
			id: string
		},
		Omit<ComponentProps<typeof EntitiesList>, 'entityType'>
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

	const contacts = derive(
		parentEntity,
		(merged) => {
			const rows = (
				(
					merged[entityFieldReference.fieldName as keyof typeof merged]
					?? []
				) as Entity<typeof schema, EntityType.BlockheadSharedAddress>[]
			)
				.toSorted((a, b) => (
					b.sharedAt - a.sharedAt
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import ContactView from '$/views/ContactView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.BlockheadSharedAddress}
	getKey={(envelope) => envelope.value[EntityMetaKey.Id].id}
	getSortValue={(envelope) => -envelope.value.sharedAt}
	{href}
	{id}
	placeholderKeys={new SvelteSet()}
	resource={contacts}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No contacts yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			<ContactView
				entityId={props.item.value[EntityMetaKey.Id]}
				href={resolve('/~/(multiplayer)/multiplayer/(contacts)/contact/[contactId]', {
					contactId: props.item.value[EntityMetaKey.Id].id,
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
