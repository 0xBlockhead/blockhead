<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { Entity } from '$/schema/$schema.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.MoneroRing>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const moneroRing = useEntity(
		EntityType.MoneroRing,
		entityId,
		{
			$$members: {},
		},
	)

	const moneroRingMembers = derive(
		moneroRing,
		(moneroRing): Entity<typeof schema, EntityType.MoneroRingMember>[] => (
			moneroRing.$$members ?? []
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MoneroRingMemberView from '$/views/MoneroRingMemberView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroRing}
	{entityId}
	title={'Monero Ring'}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		Monero Ring
	{/snippet}

	{#snippet Heading()}
		Monero Ring
	{/snippet}

	{#snippet Content()}
		<EntitiesList
			entityType={EntityType.MoneroRingMember}
			href={`#${encodeURIComponent(`${stringify(entityId)}:members`)}`}
			id={`${stringify(entityId)}:members`}
			title="Ring members"
			resource={moneroRingMembers}
			placeholderText="Loading Monero ring members..."
			getKey={(row) => stringify(row[EntityMetaKey.Id])}
			open={open}
		>
			{#snippet Item({ item: member })}
				<MoneroRingMemberView
					entityId={member[EntityMetaKey.Id]}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/snippet}
		</EntitiesList>
	{/snippet}
</EntityView>
