<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		title = 'Derivative observations',
		open = $bindable(true),
		collapsible = true,
		selection,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()



	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.Market_Derivative_Timestamp}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Funding, open interest, basis, and derivative lifecycle fields are timestamped observations rather than stable market fields.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No derivative observations yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [Source.Coingecko_OpenApi],
						limit: 64,
					})}
				placeholderText="Loading metric snapshots…"
			>
				{#snippet children(timestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.Market_Derivative_Timestamp}
						{title}
						items={timestamps.entities}
						open={true}
						{...EntitiesListProps}
						getKey={(row) => stringify(row.entitySelector)}
						getSortValue={(row) => String(row.entitySelector.timestampMs)}
						placeholderKeys={new SvelteSet<string>()}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Item({ item })}
							<Market_Derivative_TimestampView
								selector={item.entitySelector}
								id={stringify(item.entitySelector)}
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
