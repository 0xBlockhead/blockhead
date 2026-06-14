<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Contacts',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BlockheadSharedAddress>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ContactView from '$/views/ContactView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.BlockheadSharedAddress}
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

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Local_Internal,
						],
					},
				} }),
			)}
			{@const contacts = derive(
				parent,
				(parent) => {
					const blockheadSharedAddresses: readonly Entity<typeof schema, EntityType.BlockheadSharedAddress>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						blockheadSharedAddresses.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadSharedAddress}
				getKey={(envelope) => envelope.value[EntityMetaKey.Selector].id}
				getSortValue={(envelope) => -(envelope.value.sharedAt ?? 0)}
				id={`${id}-items`}
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
					<ContactView
						selector={item.value[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
