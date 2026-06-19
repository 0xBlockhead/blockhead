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

	type TronBlocksResource = EntityProxyFieldResource<
		typeof schema,
		EntityType.TronNetwork,
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
			selection: TronBlocksResource
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import TronBlockView from '$/views/TronBlockView.svelte'
</script>


<EntitiesList entityType={EntityType.TronBlock} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet TypeAnnotationTooltip()}
		<p>TRON blocks are produced by elected witnesses and contain TVM transactions.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection} placeholderText="Loading blocks…">
				{#snippet children(blocks)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.TronBlock}
						id={`${id}-items`}
						href={href}
						getKey={(block) => stringify(block.entitySelector)}
						getSortValue={(block) => -Number(block.entitySelector.height)}
						open={true}
						items={blocks.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}<p data-text="muted">No recent blocks yet.</p>{/snippet}
						{#snippet Item({ item })}
							<TronBlockView
								selection={select(EntityType.TronBlock, item.entitySelector)}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
