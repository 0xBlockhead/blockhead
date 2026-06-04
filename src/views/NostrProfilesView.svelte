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
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		entityFieldReference,
		id,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Profiles',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NostrProfile>
			id: string
			open?: boolean
			title?: string
			collapsible?: boolean
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
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NostrProfile}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Nostr profiles are kind-0 metadata events keyed by the author’s secp256k1 pubkey (64 lowercase hex characters).
		</p>
		<p>
			Display name, bio, nip-05, and avatar come from the signed kind-0 JSON content, resolved via NostrBand indexers.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No Nostr profiles in this hub yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Constants_Internal,
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						],
					},
				},
			)}
			{@const profiles = derive(
				parent,
				(parent) => {
					const nostrProfiles: Entity<typeof schema, EntityType.NostrProfile>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						nostrProfiles.map((value) => ({
							entityId: value[EntityMetaKey.Id],
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.NostrProfile}
				id={`${id}-items`}
				{title}
				resource={profiles}
				placeholderText="Loading profiles…"
				getKey={(row) => stringify(row.entityId)}
				getSortValue={(row) => row.entityId.pubkey}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No Nostr profiles in this hub yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: profile,
				})}
					<NostrProfileView
						entityId={profile.entityId}
						layout={EntityLayout.SummaryDetails}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
