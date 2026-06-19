<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type BittensorBlocksResource = EntityProxyFieldResource<
		typeof schema,
		EntityType.BittensorNetwork,
		'$$blocks'
	>
	// State
	let {
		selection,
		title = 'Blocks',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: BittensorBlocksResource
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BittensorBlockView from '$/views/BittensorBlockView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BittensorBlock}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Subtensor blocks expose the Substrate-style block hash, parent, state root, extrinsics root, and extrinsic count for Bittensor.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection}
				placeholderText="Loading blocks…"
			>
				{#snippet children(blocks)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BittensorBlock}
						id={`${id}-items`}
						href={href}
						getKey={(block) => stringify(block.entitySelector)}
						getSortValue={(block) => -Number(block.entitySelector.blockNumber)}
						open={true}
						items={blocks.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No blocks listed yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<BittensorBlockView
							selection={select(EntityType.BittensorBlock, item.entitySelector)}
							layout={EntityLayout.Summary}

						/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
