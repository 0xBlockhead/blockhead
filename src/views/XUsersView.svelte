<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityFieldReference,
		id,
		href = '',
		open = $bindable(true),
		title = 'X profiles',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.XUser>
			id: string
			href?: string
			open?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.XUser}
	{id}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
			<p>
				Public X (Twitter) profile records.
			</p>
			<p>
				Not markets, storage, Reddit, chat apps, or chain receipts. Live lookup depends on OAuth or bearer credentials and X developer API availability.
			</p>
		{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(entityCollectionsContext,
		entityFieldReference.entityType,
		entityFieldReference.entityId,({ sources: [Source.Constants_Internal], fields: { [entityFieldReference.fieldName]: {
				sources: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				],
			},
		} }),
	)}
			{@const users = derive(
		parent,
		(parent) => {
			const xUsers: readonly Entity<typeof schema, EntityType.XUser>[] = (
				parent.fields[entityFieldReference.fieldName]?.values ?? []
			)
			return (
				xUsers
					.map((value) => ({
						value,
					}))
			)
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.XUser}
				id={`${id}-items`}
				href={href}
				{title}
				getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
				getSortValue={(row) => stringify(row.value[EntityMetaKey.Id])}
				resource={users}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
						<p data-text="muted">
							No X profiles in this xUsers yet.
						</p>
					{/snippet}

				{#snippet Item({ item })}
						<XUserView
							entityId={item.value[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}

			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
