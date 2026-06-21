<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		title = 'Currencies',
		open = $bindable(true),
		collapsible = true,
		selection,
				...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Currency>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.Currency}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			ISO&nbsp;4217 fiat units referenced as market quote legs (USD, EUR, …).
		</p>
		<p>
			Ordered by catalog FX turnover weight (see each currency’s snapshot), not alphabetically.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No currencies in this context yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
				<ResourceBoundary resource={selection({
						sources: [
							Source.Constants_Internal,
						],
					})} placeholderText="Loading currencies…">
				{#snippet children(currencies)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						{...EntitiesListProps}
						entityType={EntityType.Currency}
						getKey={(currency) => currency.entitySelector.iso4217}
						getSortValue={(currency) => currency.entitySelector.iso4217}
						items={currencies.entities}
						{title}
						open={true}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No currencies in this context yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<a
								href={resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]', {
									iso4217: item.entitySelector.iso4217,
								})}
							>
								<TruncatedValue
									value={item.entitySelector.iso4217}
									format={TruncatedValueFormat.Visual}
								/>
							</a>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
