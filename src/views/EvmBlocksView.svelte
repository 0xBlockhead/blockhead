<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'


	// State
	let {
		entityFieldReference,
		title = 'Blocks',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmBlock>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmBlock}

	{id}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Execution blocks group ordered transactions under one header: gas usage, fee market, and parent hash linkage.
		</p>
		<p>
			Receipts carry receipt logs (<code>LOG</code> opcodes) with indexed topics; blob transactions add data availability commitments without changing how contracts are decoded.
		</p>
		<p>
			Recent block lists are often capped for RPC cost.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector,
					).field(entityFieldReference.fieldName, {
						sources: [
							Source.Voltaire_JsonRpc,
						],
						limit: 16,
						count: true,
					})}
				placeholderText="Loading execution blocks…"
			>
				{#snippet children(blocks)}
					<div data-column="gap-3">
						<EntitiesList
							collapsible={false}
							showSummary={false}
							entityType={EntityType.EvmBlock}
							id={`${id}-items`}
							{title}
							open={true}
							getKey={(row) => String(row.entitySelector.blockNumber)}
							getSortValue={(row) => (
								-Number(row.entitySelector.blockNumber)
							)}
							items={blocks.entities}
							UnorderedListProps={{ orientation: ListOrientation.Column }}
						>
							{#snippet Empty()}
								<p data-text="muted">
									No recent blocks yet.
								</p>
							{/snippet}

							{#snippet Item({ item })}
								<EvmBlockView
									selector={item.entitySelector}
									layout={EntityLayout.Summary}

								/>
							{/snippet}
						</EntitiesList>
					</div>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
