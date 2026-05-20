<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

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
		title = 'Contacts',
		open = $bindable(true),
		collapsible = true,
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import ContactView from '$/views/ContactView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	{collapsible}
	entityType={EntityType.BlockheadSharedAddress}
	{href}
	{id}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Contacts are execution addresses a peer has shared for this collaboration room.
		</p>
		<p>
			They support session routing—not a generic address book export from a wallet.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No shared contacts yet.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				},
			)}
			{@const contacts = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.BlockheadSharedAddress>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadSharedAddress}
				getKey={(envelope) => envelope.value[EntityMetaKey.Id].id}
				getSortValue={(envelope) => -envelope.value.sharedAt}
				{href}
				id={`${id}-items`}
				placeholderKeys={new SvelteSet()}
				resource={contacts}
				{title}
				open={true}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No shared contacts yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{#if item}
						<ContactView
							entityId={item.value[EntityMetaKey.Id]}
							href={resolve('/~/(multiplayer)/multiplayer/(contacts)/contact/[contactId]', {
								contactId: item.value[EntityMetaKey.Id].id,
							})}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
