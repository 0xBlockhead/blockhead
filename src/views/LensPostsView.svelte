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
		href,
		id,
		limit = 25,
		open = $bindable(true),
		title = 'Lens v3 publications',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LensPost>
			href: string
			id: string
			limit?: number
			open?: boolean
			title?: string
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

	const lensNetworkOrAccount = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			open ?
				(
					entityFieldReference.entityType === EntityType.LensNetwork ?
						{
							$: [Source.Constants_Internal],
							protocolName: {},
							$$lensPosts: {
								$: [
									Source.Constants_Internal,
									Source.Lens_Graphql,
								],
							},
						}
					:
						{
							$: [
								Source.Constants_Internal,
								Source.Lens_Graphql,
							],
							$$posts: {},
						}
				)
			:
				{}
		),
	)

	const posts = derive(
		lensNetworkOrAccount,
		(loaded) => {
			const rows: Entity<typeof schema, EntityType.LensPost>[] = (
				(
					entityFieldReference.entityType === EntityType.LensNetwork ?
						loaded.$$lensPosts
					:
						loaded.$$posts
				)
				?? []
			)
			return (
				rows
					.toSorted((a, b) => (
						(b.timestamp ?? 0) - (a.timestamp ?? 0)
					))
					.slice(0, limit)
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<EntitiesList
	entityType={EntityType.LensPost}
	{href}
	{id}
	bind:open
	{title}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Lens publications are recorded on-chain.
		</p>
		<p>
			They are not generic off-chain mirrors unless the protocol itself points at one.
		</p>
	{/snippet}

	{#snippet body()}
		{#key `${stringify(entityFieldReference.entityId)}-${limit}`}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.LensPost}
				id={`${id}-items`}
				{href}
				{title}
				open={true}
				getKey={(row) => row[EntityMetaKey.Id].id}
				getSortValue={(row) => (
					-(row.timestamp ?? 0)
				)}
				placeholderKeys={new SvelteSet()}
				resource={posts}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No Lens publications in this slice yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						<LensPostView
							entityId={{ id: props.item[EntityMetaKey.Id].id }}
							href={resolve('/(social)/lens/post/[postId]', {
								postId: encodeURIComponent(props.item[EntityMetaKey.Id].id),
							})}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/key}
	{/snippet}
</EntitiesList>
