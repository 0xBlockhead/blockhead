<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'

	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		open = $bindable(true),
		title = 'Subreddits',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.RedditSubreddit>
		href: string
		id: string
		open?: boolean
		title?: string
	} = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const fieldName = entityFieldReference.fieldName

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Reddit_Rest,
			],
			...(
				open ?
					{
						[fieldName]: {
							$: [
								Source.Reddit_Rest,
							],
						},
					}
				:
					{}
			),
		},
	)

	const subreddits = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.RedditSubreddit>[] = (
				merged[fieldName] ?? []
			)
			return (
				rows
					.toSorted((a, b) => (
						stringify(a[EntityMetaKey.Id]).localeCompare(stringify(b[EntityMetaKey.Id]))
					))
					.map((value) => ({
						entityId: value[EntityMetaKey.Id],
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<EntitiesList
	entityType={EntityType.RedditSubreddit}
	{href}
	{id}
	{title}
	bind:open
	resource={subreddits}
	placeholderText="Loading subreddits…"
	getKey={(row) => stringify(row.entityId)}
	getSortValue={(row) => row.entityId.name}
	placeholderKeys={new SvelteSet<string>()}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Named communities on Reddit (<code>/r/…</code>).
		</p>
		<p>
			Not chat inboxes, storage roots, or profile graphs from other networks.
		</p>
		<p>
			Each list row is a Reddit community namespace—compare to profiles on X or blobs on content-addressed storage.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No subreddits in this Reddit hub yet.
		</p>
	{/snippet}

	{#snippet Item({
		item: row,
	})}
		{#if row}
			<RedditSubredditView
				entityId={row.entityId}
				href={resolve('/(social)/reddit/r/[name]', {
					name: encodeURIComponent(row.entityId.name),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>

