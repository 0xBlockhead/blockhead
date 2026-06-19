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
		title = 'Error selectors',
		id,
				...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmError>
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
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmError}

	{id}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Global registry of four-byte error selectors for custom and standard revert shapes—same width as calldata selectors but used when decoding failures.
		</p>
		<p>
			They pair with ABI tail words rather than log topics.
		</p>
		<p>
			Rows filter the shared directory by the current field predicate.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [Source.Local_Internal],
					})}
				placeholderText="Loading errors…"
			>
				{#snippet children(errors)}
			<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmError}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(error) => error.entitySelector.hex}
					getSortValue={(error) => error.entitySelector.hex}
					placeholderText="Loading revert/error selectors…"
					items={errors.entities}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No error selectors yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<EvmErrorView
							selection={select(EntityType.EvmError, item.entitySelector)}
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
