<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type EvmBlocksResource = EntityProxyEntitiesResource<
		typeof schema,
		EntityType.EvmBlock
	>


	// State
	let {
		selection,
		title = 'Blocks',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EvmBlocksResource
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
				resource={selection}
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
							getKey={(row) => stringify(row.entitySelector)}
							getSortValue={(row) => stringify(row.entitySelector)}
							items={blocks.values}
							UnorderedListProps={{ orientation: ListOrientation.Column }}
						>
							{#snippet Empty()}
								<p data-text="muted">
									No recent blocks yet.
								</p>
							{/snippet}

							{#snippet Item({ item })}
								<EvmBlockView
									selection={select(EntityType.EvmBlock, item.entitySelector)}
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
