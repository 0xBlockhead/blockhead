<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'


	// Props
	let {
		entityFieldReference,
		id = 'casts',
		href = resolve('/farcaster/feed'),
		title = 'Casts',
		limit = 25,
		open = $bindable(true),
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.FarcasterCast
			>
			id?: string
			href?: string
			title?: string
			limit?: number
			open?: boolean
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


	const parentFeed = useEntity(
		EntityType.FarcasterFeed,
		entityFieldReference.entityId,
		{
			$: [
				import.meta.env.PUBLIC_NEYNAR_API_KEY?.trim() ?
					Source.Neynar_Rest
				:
					Source.Snapchain_Rest,
			],
			$$entries: {},
		},
	)

	const casts = derive(
		parentFeed,
		(merged) => (
			[...(merged.$$entries ?? [])]
				.toSorted((a, b) => (
					stringify(b[EntityMetaKey.Id]).localeCompare(stringify(a[EntityMetaKey.Id]))
				))
				.slice(0, limit)
				.map((result) => ({
					result,
				}))
		),
	)
</script>


<EntitiesList
	entityType={EntityType.FarcasterCast}
	{id}
	{href}
	{title}
	bind:open
	getKey={(row) => stringify(row.result[EntityMetaKey.Id])}
	placeholderKeys={new SvelteSet()}
	placeholderText="Loading casts…"
	resource={casts}
	{...entitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			No casts to show yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const castId = props.item.result[EntityMetaKey.Id]}
			<FarcasterCastView
				entityId={{
					fid: castId.fid,
					hash: castId.hash,
				}}
				href={resolve('/(social)/(farcaster)/farcaster/(feed)/cast/[fid]/[hash]', {
					fid: String(castId.fid),
					hash: String(castId.hash),
				})}
				layout={EntityLayout.Summary}
				open={false}
				variant="feed"
			/>
		{/if}
	{/snippet}
</EntitiesList>
