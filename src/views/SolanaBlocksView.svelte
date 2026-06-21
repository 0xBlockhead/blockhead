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

	type SolanaBlocksResource = EntityProxyFieldResource<
		typeof schema,
		EntityType.SolanaNetwork,
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
			selection: SolanaBlocksResource
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
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
</script>


<EntitiesList
	entityType={EntityType.SolanaBlock}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Solana blocks are produced for slots and contain transactions executed by the SVM runtime.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection} placeholderText="Loading blocks…">
				{#snippet children(blocks)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.SolanaBlock}
						id={`${id}-items`}
						href={href}
						getKey={(block) => stringify(block.entitySelector)}
						open={true}
						items={blocks.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}<p data-text="muted">No recent blocks yet.</p>{/snippet}
						{#snippet Item({ item })}
							<SolanaBlockView
								selection={select(EntityType.SolanaBlock, item.entitySelector)}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
