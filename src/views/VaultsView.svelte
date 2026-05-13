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


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import VaultView from '$/views/VaultView.svelte'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		open = $bindable(true),
		title = 'Vaults',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Vault>
			href: string
			id: string
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

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: [
					Source.Dexscreener_OpenApi,
				],
			},
		},
	)

	const envelopes = derive(
		parentEntity,
		(merged) => {
			const rows = (
				(
					merged[entityFieldReference.fieldName as keyof typeof merged]
					?? []
				) as Entity<typeof schema, EntityType.Vault>[]
			)
				.toSorted((a, b) => (
					a[EntityMetaKey.Id].id.localeCompare(b[EntityMetaKey.Id].id)
				))
			return (
				rows.map((value) => ({
					value,
				}))
			)
		},
	)
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.Vault}
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
	{href}
	{id}
	resource={envelopes}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Item(props)}
		{#if props.item}
			<VaultView
				entityId={props.item.value[EntityMetaKey.Id]}
				href={resolve('/(assets)/(vaults)/vault/[vaultId]', {
					vaultId: props.item.value[EntityMetaKey.Id].id,
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
