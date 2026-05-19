<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'


	// Props
	let {
		entityFieldReference,
		id = 'profiles',
		href = resolve('/farcaster/users'),
		title = 'Farcaster profiles',
		open = $bindable(true),
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterUser>
			id?: string
			href?: string
			title?: string
			open?: boolean
		},
		Omit<ComponentProps<typeof EntitiesList>, 'entityType'>
	> = $props()


	// State
	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: [
					Source.Snapchain_Rest,
				],
			},
		},
	)

	const users = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.FarcasterUser>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
				.toSorted((a, b) => (
					a[EntityMetaKey.Id].fid - b[EntityMetaKey.Id].fid
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
	entityType={EntityType.FarcasterUser}
	{id}
	{href}
	{title}
	bind:open
	getKey={(envelope) => envelope.value[EntityMetaKey.Id].fid}
	getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].fid}
	placeholderKeys={new SvelteSet<number>()}
	placeholderText="Loading profiles…"
	resource={users}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Farcaster profiles are on-chain-anchored identities keyed by numeric FID, with off-chain social graph data on hubs.
		</p>
		<p>
			A single directory response is always a bounded subset (e.g. one hub’s registry snapshot)—never the entire protocol user set in one page.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No profiles in this slice yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const userId = props.item.value[EntityMetaKey.Id]}
			<FarcasterUserView
				entityId={{ fid: userId.fid }}
				href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
					userId: String(userId.fid),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
