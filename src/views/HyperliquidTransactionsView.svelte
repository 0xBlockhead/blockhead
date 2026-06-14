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
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.HyperliquidTransaction>
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
	import HyperliquidTransactionView from '$/views/HyperliquidTransactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.HyperliquidTransaction}
	{title}
	bind:open
	{id}
	{href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>Hyperliquid transactions here are HyperEVM execution transactions resolved through JSON-RPC blocks.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Hyperliquid_JsonRpc,
						],
						limit: 16,
					},
				} }),
			)}
			{@const transactions = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.HyperliquidTransaction>[] => (
					(parent.fields[entityFieldReference.fieldName]?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.HyperliquidTransaction}
				id={`${id}-items`}
				{href}
				getKey={(transaction) => stringify(transaction[EntityMetaKey.Selector])}
				getSortValue={(transaction) => stringify(transaction[EntityMetaKey.Selector])}
				open={true}
				resource={transactions}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">No recent transactions yet.</p>
				{/snippet}

				{#snippet Item(context)}
					<HyperliquidTransactionView
						selector={context!.item[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
