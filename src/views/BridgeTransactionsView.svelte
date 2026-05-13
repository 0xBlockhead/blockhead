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

	type BridgeTxRow = {
		value: Entity<typeof schema, EntityType.BridgeTransaction>
	}


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import BridgeTransactionView from '$/views/BridgeTransactionView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Transactions',
		open = $bindable(true),
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BridgeTransaction>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			| 'entityType'
			| 'getKey'
			| 'getSortValue'
			| 'items'
			| 'resource'
			| 'Item'
			| 'body'
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

	const bridgeTransactions = derive(
		parentEntity,
		(merged): BridgeTxRow[] => {
			const rows = (
				(
					merged[entityFieldReference.fieldName as keyof typeof merged]
					?? []
				) as Entity<typeof schema, EntityType.BridgeTransaction>[]
			)
				.toSorted((a, b) => (
					`${String(a[EntityMetaKey.Id].createdAt)}\0${stringify(a[EntityMetaKey.Id])}`
						.localeCompare(`${String(b[EntityMetaKey.Id].createdAt)}\0${stringify(b[EntityMetaKey.Id])}`)
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
	entityType={EntityType.BridgeTransaction}
	{title}
	bind:open
	resource={bridgeTransactions}
	placeholderText="Loading transactions…"
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => (
		`${String(row.value[EntityMetaKey.Id].createdAt)}\0${stringify(row.value[EntityMetaKey.Id])}`
	)}
	placeholderKeys={new SvelteSet<string | number>()}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListRest}
>
	{#snippet Empty()}
		<p data-text="muted">
			No bridge transactions yet.
		</p>
	{/snippet}

	{#snippet Item({
		item: row,
		isPlaceholder,
	})}
		{#if isPlaceholder === false}
			{@const id = row.value[EntityMetaKey.Id]}
			<BridgeTransactionView
				entityId={id}
				href={resolve(
					`/~/accounts/transaction/${id.$account.$network.chainId}/${id.$account.address}/${id.$sourceTx.txHash}/${id.createdAt}`,
				)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
