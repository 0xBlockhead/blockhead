<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context


	// State
	let {
		selection,
		open = $bindable(true),
		collapsible = true,
		title = 'Selectors',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmSelector>
			open?: boolean
			collapsible?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.EvmSelector}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Function selectors are the first four bytes of keccak(functionName(types)) used as the calldata discriminator on EVM chains.
		</p>
		<p>
			Catalogs map those bytes to human-readable signatures—distinct from receipt log topics or social posts.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No contract function selectors indexed yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [Source.Openchain_Rest],
					})}
				placeholderText="Loading selectors…"
			>
				{#snippet children(selectors)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.EvmSelector}
						getKey={(selector) => selector.entitySelector.hex}
						getSortValue={(selector) => selector.entitySelector.hex}
						open={true}
						items={selectors.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No contract function selectors indexed yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<EvmSelectorView
								selection={select(EntityType.EvmSelector, item.entitySelector)}
								layout={EntityLayout.Summary}

								showTypeAnnotation={false}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
