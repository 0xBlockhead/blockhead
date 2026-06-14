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
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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
			collapsible?: boolean
			title?: string
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
			{@const lensNetworkOrAccount = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,
				(
					entityFieldReference.entityType === EntityType.LensNetwork ?
						{
							sources: [Source.Constants_Internal],
							fields: {
								protocolName: true,
								$$lensPosts: {
									sources: [
										Source.Lens_Graphql,
									],
									limit: limit,
								},
							},
						}
					:
						{
							fields: {
								$$posts: {
									sources: [
										Source.Lens_Graphql,
									],
									limit: limit,
								},
							},
						}
				),
			)}
			{@const posts = derive(
				lensNetworkOrAccount,
				(lensNetworkOrAccount) => {
					const lensPosts: readonly Entity<typeof schema, EntityType.LensPost>[] = (
						(
							entityFieldReference.entityType === EntityType.LensNetwork ?
								lensNetworkOrAccount.fields.$$lensPosts?.values
							:
								lensNetworkOrAccount.fields.$$posts?.values
						)
						?? []
					)
					return lensPosts
				},
			)}
			{#key `${stringify(entityFieldReference.selector)}-${limit}`}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.LensPost}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(row) => row[EntityMetaKey.Selector].id}
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
							selector={{ id: item[EntityMetaKey.Selector].id }}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
