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
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Transactions',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.SolanaTransaction>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.SolanaTransaction}
	{title}
	bind:open
	{id}
	{href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>Solana transactions bundle signatures and SVM instructions executed in a slot.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Solana_JsonRpc,
						],
						limit: 16,
					},
				} }),
			)}
			{@const transactions = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.SolanaTransaction>[] => (
					(parent.fields[entityFieldReference.fieldName]?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.SolanaTransaction}
				id={`${id}-items`}
				{href}
				getKey={(transaction) => stringify(transaction[EntityMetaKey.Id])}
				getSortValue={(transaction) => -Number(transaction.slot ?? 0n)}
				open={true}
				resource={transactions}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">No recent transactions yet.</p>
				{/snippet}

				{#snippet Item(context)}
					<SolanaTransactionView
						entityId={context!.item[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
