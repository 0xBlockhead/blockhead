<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'MEV-Boost relay payloads',
		open = $bindable(true),
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.MevRelay_ProposerPayloadDelivered
			>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const fieldName = entityFieldReference.fieldName

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.MevRelay_Rest,
			],
			[fieldName]: {
				$: [
					Source.MevRelay_Rest,
				],
				$limit: 64,
			},
		},
	)

	const rows = derive(
		parentEntity,
		(merged) => {
			const list: Entity<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>[] = (
				merged[fieldName] ?? []
			)
			return (
				list
					.map((value) => ({
						value,
					}))
			)
		},
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import MevRelay_ProposerPayloadDeliveredView from '$/views/MevRelay_ProposerPayloadDeliveredView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.MevRelay_ProposerPayloadDelivered}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => (
		-row.value[EntityMetaKey.Id].slot
	)}
	placeholderKeys={new SvelteSet<string>()}
	resource={rows}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No relay payloads yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const row = props.item.value}
			<MevRelay_ProposerPayloadDeliveredView
				entityId={row[EntityMetaKey.Id]}
				href={resolve(
					'/(explore)/(networks)/network/[networkId]',
					{ networkId: String(row[EntityMetaKey.Id].$network.chainId) },
				)}
				id={stringify(row[EntityMetaKey.Id])}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
