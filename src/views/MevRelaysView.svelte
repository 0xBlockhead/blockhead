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


	// State
	let {
		selection,
		title = 'Relays',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
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
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


<EntitiesList
	entityType={EntityType.MevRelay}
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
						sources: [
							Source.Constants_Internal,
						],
						limit: 16,
					})}
				placeholderText="Loading relays…"
			>
				{#snippet children(relays)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.MevRelay}
						id={`${id}-items`}
						href={href}
						getKey={(relay) => relay.entitySelector.host}
						items={relays.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						open={true}
					>
						{#snippet Empty()}
							<p data-text="muted">No MEV relays mapped for this network.</p>
						{/snippet}

						{#snippet Item({ item: relay })}
							<MevRelayView
								selector={relay.entitySelector}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
