<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { Entity } from '$/schema/$schema.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


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

	{#snippet Content()}
		<EntitiesList
			entityType={EntityType.MoneroRingMember}
			href={`#${encodeURIComponent(`${stringify(entityId)}:members`)}`}
			id={`${stringify(entityId)}:members`}
			title="Ring members"
			bind:open
			collapsible={false}
		>
			{#snippet body()}
				{#if open}
					{@const moneroRing = useEntity(
						EntityType.MoneroRing,
						entityId,
						{
							$$members: {},
						},
					)}
					{@const moneroRingMembers = derive(
						moneroRing,
						(moneroRing): Entity<typeof schema, EntityType.MoneroRingMember>[] => (
							moneroRing.$$members ?? []
						),
					)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.MoneroRingMember}
						href={`#${encodeURIComponent(`${stringify(entityId)}:members`)}`}
						id={`${stringify(entityId)}:members-items`}
						title="Ring members"
						open={true}
						resource={moneroRingMembers}
						placeholderText="Loading Monero ring members..."
						getKey={(row) => stringify(row[EntityMetaKey.Id])}
					>
						{#snippet Item({ item: member })}
							<MoneroRingMemberView
								entityId={member[EntityMetaKey.Id]}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/snippet}
					</EntitiesList>
				{/if}
			{/snippet}
		</EntitiesList>
	{/snippet}
</EntityView>
