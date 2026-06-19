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
		title = 'Builders',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.MevBuilder>
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
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


<EntitiesList
	entityType={EntityType.MevBuilder}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet body()}
		{#if open}
				<ResourceBoundary
					resource={selection({
						sources: [Source.MevRelay_Rest],
						limit: 16,
					})}
				placeholderText="Loading builders…"
			>
				{#snippet children(builders)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.MevBuilder}
				id={`${id}-items`}
				href={href}
				getKey={(builder) => builder.entitySelector.builderPubkey}
				placeholderText="Loading builders…"
				items={builders.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">No MEV builders loaded yet.</p>
				{/snippet}

				{#snippet Item({ item: builder })}
					<MevBuilderView
						selection={select(EntityType.MevBuilder, builder.entitySelector)}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
