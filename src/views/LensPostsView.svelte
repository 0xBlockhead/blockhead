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


	// State
	let {
		entityFieldReference,
		id,
		limit = 25,
		open = $bindable(true),
		collapsible = true,
		title = 'Lens v3 publications',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LensPost>
			id: string
			limit?: number
			open?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<EntitiesList
	entityType={EntityType.LensPost}
	{id}
	bind:open
	{title}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Lens publications are recorded on-chain.
		</p>
		<p>
			They are not generic off-chain mirrors unless the protocol itself points at one.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const lensNetworkOrAccount = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				(
					entityFieldReference.entityType === EntityType.LensNetwork ?
						{
							$: [Source.Constants_Internal],
							protocolName: {},
							$$lensPosts: {
								$: [
									Source.Lens_Graphql,
									Source.Hey_Graphql,
								],
							},
						}
					:
						{
							$$posts: {
								$: [
									Source.Lens_Graphql,
									Source.Hey_Graphql,
								],
							},
						}
				),
			)}
			{@const posts = derive(
				lensNetworkOrAccount,
				(lensNetworkOrAccount) => {
					const rows: Entity<typeof schema, EntityType.LensPost>[] = (
						(
							entityFieldReference.entityType === EntityType.LensNetwork ?
								lensNetworkOrAccount.$$lensPosts
							:
								lensNetworkOrAccount.$$posts
						)
						?? []
					)
					return rows.slice(0, limit)
				},
			)}
			{#key `${stringify(entityFieldReference.entityId)}-${limit}`}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.LensPost}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(row) => row[EntityMetaKey.Id].id}
					getSortValue={(row) => (
						-(row.timestamp ?? 0)
					)}
					resource={posts}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No Lens publications in this slice yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<LensPostView
							entityId={{ id: item[EntityMetaKey.Id].id }}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
