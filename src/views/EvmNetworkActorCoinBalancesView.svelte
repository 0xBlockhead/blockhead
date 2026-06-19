<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		title = 'Balances',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmNetworkActorCoinBalance>
			title?: string
			open?: boolean
			collapsible?: boolean
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
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmAccount}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Balances are grouped by watched account; each account resolves indexed token balances across supported execution networks.
		</p>
		<p>
			Balance rows come from provider-backed network account resolvers, while the watched-account list comes from local account state.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No balances yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={select(
						EntityType._Global,
						{ scope: '$$actors' },
						{
							sources: [
								Source.Local_Internal,
							],
						},
					).$$actors({
						sources: [
							Source.Local_Internal,
						],
					})}
				placeholderText={`Loading ${title.toLowerCase()}…`}
			>
				{#snippet children(actors)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmAccount}
				{title}
				open={true}
				getKey={(actor) => stringify(actor.entitySelector)}
				getSortValue={(actor) => stringify(actor.entitySelector)}
				placeholderKeys={new SvelteSet<string>()}
				placeholderText={`Loading ${title.toLowerCase()}…`}
				items={actors.entities}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No balances yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const id = item.entitySelector}
					<EvmAccountView
						selection={select(EntityType.EvmAccount, id)}
						layout={EntityLayout.SummaryDetails}
						open={true}
					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
