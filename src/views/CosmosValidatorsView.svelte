<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Validators',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosValidator>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosValidatorView from '$/views/CosmosValidatorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.CosmosValidator}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Cosmos validators participate in CometBFT consensus and SDK staking/slashing state.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [Source.CosmosSdk_Rest],
						limit: 32,
					})}
				placeholderText="Loading validators…"
			>
				{#snippet children(validators)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.CosmosValidator}
						id={`${id}-items`}
						href={href}
						getKey={(validator) => stringify(validator.entitySelector)}
						getSortValue={(validator) => stringify(validator.entitySelector)}
						open={true}
						items={validators.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No validators listed yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<CosmosValidatorView
							selection={select(EntityType.CosmosValidator, item.entitySelector)}
							layout={EntityLayout.Summary}

						/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
