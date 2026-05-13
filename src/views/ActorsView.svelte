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
		title = 'Accounts',
		href,
		id,
		open = $bindable(true),
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

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: [
					Source.Local_Internal,
				],
			},
		},
	)

	const actors = derive(
		parentEntity,
		(merged) => {
			const rows = (
				(
					merged[entityFieldReference.fieldName as keyof typeof merged]
					?? []
				) as Entity<typeof schema, EntityType.Actor>[]
			)
				.toSorted((a, b) => (
					a[EntityMetaKey.Id].address.toLowerCase()
						.localeCompare(b[EntityMetaKey.Id].address.toLowerCase())
				))
			return (
				rows.map((value) => ({
					value,
				}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ActorView from '$/views/ActorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Actor}
	{href}
	{id}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => row.value[EntityMetaKey.Id].address.toLowerCase()}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	resource={actors}
	{title}
	{...entitiesListRest}
>
	{#snippet Empty()}
		<p data-text="muted">
			No accounts yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const aid = props.item.value[EntityMetaKey.Id]}
			<ActorView
				entityId={aid}
				href={resolve('/~/(accounts)/accounts/account/[accountId]', {
					accountId: aid.address,
				})}
				layout={EntityLayout.Summary}
				open={false}
				title="Account"
			/>
		{/if}
	{/snippet}
</EntitiesList>
