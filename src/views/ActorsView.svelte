<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	let {
		entityFieldReference,
		title = 'Linked wallets',
		href,
		id,
		open = $bindable(true),
		collapsible = true,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Actor>
			href: string
			id: string
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import ActorView from '$/views/ActorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Actor}
	{href}
	{id}
	bind:open
	{collapsible}
	{title}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Linked wallets are execution-layer addresses associated with this facet (account, room, or profile).
		</p>
		<p>
			Empty lists usually mean nothing has been linked yet or the parent entity has not loaded its relations fully.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No linked wallets in this list yet.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				},
			)}
			{@const actors = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.Actor>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Actor}
				id={`${id}-items`}
				{href}
				{title}
				open={true}
				getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
				getSortValue={(row) => row.value[EntityMetaKey.Id].address.toLowerCase()}
				placeholderKeys={new SvelteSet<string>()}
				placeholderText="Loading linked wallets…"
				resource={actors}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No linked wallets in this list yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						{@const aid = props.item.value[EntityMetaKey.Id]}
						<ActorView
							entityId={aid}
							href={resolve('/account/[address]', {
								address: aid.address,
							})}
							layout={EntityLayout.Summary}
							open={false}
							title="Account"
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
