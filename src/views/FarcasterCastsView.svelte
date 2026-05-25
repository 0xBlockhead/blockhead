<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// State
	let {
		entityFieldReference,
		id = 'casts',
		title = 'Casts',
		limit = 25,
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.FarcasterCast
			>
			id?: string
			title?: string
			limit?: number
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterCast}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Casts are immutable messages (FID + hash) referenced by feeds; trending, author, and channel feeds differ only in hub query semantics.
		</p>
		<p>
			An empty feed response usually means no hashes matched that filter at the hub—not that the chain halted.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No casts yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parentFeed = useEntity(
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
			)}
			{@const casts = derive(
				parentFeed,
				(parentFeed) => (
					[...(parentFeed.$$entries ?? [])]
						.slice(0, limit)
						.map((result) => ({
							result,
						}))
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.FarcasterCast}
				id={`${id}-items`}
				href={EntitiesListProps.href}
				{title}
				open={true}
				getKey={(row) => stringify(row.result[EntityMetaKey.Id])}
				getSortValue={(row) => stringify(row.result[EntityMetaKey.Id])}
				placeholderText="Loading feed casts (Farcaster FID + cast hash)…"
				resource={casts}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No casts yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const castId = item.result[EntityMetaKey.Id]}
					<FarcasterCastView
						entityId={{
							fid: castId.fid,
							hash: castId.hash,
						}}
						layout={EntityLayout.Summary}
						open={false}
						variant="feed"
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
