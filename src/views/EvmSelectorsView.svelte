<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
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
		title = '4-byte selectors',
		id,
				...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
			open?: boolean
			collapsible?: boolean
			title?: string
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmSelector}

	{id}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Four-byte function selectors prefix calldata for contract calls; catalogs map them to human-readable signatures.
		</p>
		<p>
			Receipt logs and error selectors follow different decoding rules on receipts and reverts.
		</p>
		<p>
			Rows filter the shared OpenChain-style directory for the current slice.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [Source.Local_Internal],
					})}
				placeholderText="Loading selectors…"
			>
				{#snippet children(selectors)}
			<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmSelector}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(evmSelector) => evmSelector.entitySelector.hex}
					getSortValue={(evmSelector) => evmSelector.entitySelector.hex}
					placeholderText="Loading 4-byte selectors…"
					items={selectors.entities}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No selectors yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<EvmSelectorView
							selector={item.entitySelector}
							layout={EntityLayout.Summary}

							collapsible={false}
							showTypeAnnotation={false}
						/>
					{/snippet}
				</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
