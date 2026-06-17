<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
		import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Blocks',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.UtxoBlock>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
</script>


<EntitiesList
	entityType={EntityType.UtxoBlock}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			UTXO blocks order transactions that spend previous outputs and create new spendable outputs.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector,
					).field(entityFieldReference.fieldName, {
						sources: [
							Source.Blockchair_Rest,
							Source.Esplora_Rest,
							Source.MempoolSpace_Rest,
							Source.BitcoinCore_JsonRpc,
							Source.LitecoinCore_JsonRpc,
							Source.DogecoinCore_JsonRpc,
							Source.BitcoinCashNode_JsonRpc,
							Source.Zcashd_JsonRpc,
						],
						limit: 16,
					})}
				placeholderText="Loading blocks…"
			>
				{#snippet children(blocks)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.UtxoBlock}
				id={`${id}-items`}
				href={href}
				getKey={(block) => stringify(block.entitySelector)}
				getSortValue={(block) => -Number(block.entitySelector.height)}
				open={true}
				items={blocks.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No recent blocks yet.
					</p>
				{/snippet}

				{#snippet Item(context)}
					<UtxoBlockView
						selector={context!.item.entitySelector}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
