<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import { stringify } from 'devalue'

	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	type BridgeTxRow = {
		value: Entity<typeof schema, EntityType.BridgeTransaction>
	}


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		title = 'Bridge transactions',
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			open ?
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				}
			:
				{}
		),
	)

	const bridgeTransactions = derive(
		parent,
		(parent): BridgeTxRow[] => {
			const rows: Entity<typeof schema, EntityType.BridgeTransaction>[] = (
				parent[entityFieldReference.fieldName] ?? []
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import BridgeTransactionView from '$/views/BridgeTransactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BridgeTransaction}
	{title}
	bind:open
	resource={bridgeTransactions}
	placeholderText="Loading bridge transactions…"
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => (
		`${String(row.value[EntityMetaKey.Id].createdAt)}\0${stringify(row.value[EntityMetaKey.Id])}`
	)}
	placeholderKeys={new SvelteSet<string | number>()}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row records origin-side proof you initiated a cross-chain transfer: account, source chain, and source transaction hash.
		</p>
		<p>
			Bridging is usually multi-step: a source-chain transaction locks or burns funds, then relays or light clients justify a release mint on the destination.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No bridge transactions yet.
		</p>
	{/snippet}

	{#snippet Item({
		item: row,
	})}
		{#if row}
			{@const id = row.value[EntityMetaKey.Id]}
			<BridgeTransactionView
				entityId={id}
				href={resolve(
					'/~/(accounts)/accounts/(transactions)/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]',
					{
						chainId: String(id.$account.$network.chainId),
						address: id.$account.address,
						sourceTxHash: id.$sourceTx.txHash,
						createdAt: String(id.createdAt),
					},
				)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
