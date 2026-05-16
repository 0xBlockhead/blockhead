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
		title = 'Gas fee snapshots',
		open = $bindable(true),
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Network_GasFee_Timestamp>
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
				Source.Voltaire_JsonRpc,
			],
			[fieldName]: {
				$: [
					Source.Voltaire_JsonRpc,
				],
				$limit: 64,
			},
		},
	)

	const rows = derive(
		parentEntity,
		(merged) => {
			const list: Entity<typeof schema, EntityType.Network_GasFee_Timestamp>[] = (
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
	import Network_GasFee_TimestampView from '$/views/Network_GasFee_TimestampView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.Network_GasFee_Timestamp}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => (
		-Number(row.value[EntityMetaKey.Id].timestampNs)
	)}
	placeholderKeys={new SvelteSet<string>()}
	resource={rows}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No gas snapshots yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const row = props.item.value}
			<Network_GasFee_TimestampView
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
