<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
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
			{@const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [Source.Constants_Internal],
			[entityFieldReference.fieldName]: {
				$: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				],
			},
		},
	)}
			{@const users = derive(
		parent,
		(parent) => {
			const xUsers: Entity<typeof schema, EntityType.XUser>[] = (
				parent[entityFieldReference.fieldName] ?? []
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
				getSortValue={(row) => row.value[EntityMetaKey.Id].id}
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
							entityId={{ id: item.value[EntityMetaKey.Id].id }}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}

			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
