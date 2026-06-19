<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
		import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		selection,
		title = 'ERC-4337 paymasters',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Erc4337Paymaster>
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
	import Erc4337PaymasterView from '$/views/Erc4337PaymasterView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Erc4337Paymaster}
	{id}
	{title}
	bind:open
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Paymasters are gas-sponsorship contracts in ERC-4337, distinct from smart accounts and bundler operators.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
				<ResourceBoundary
					resource={selection({
						sources: [
							Source.Blockscout_Rest,
						],
						limit: 16,
					})}
				placeholderText="Loading paymasters…"
			>
				{#snippet children(paymasters)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Erc4337Paymaster}
				id={`${id}-items`}
				href={href}
				getKey={(paymaster) => stringify(paymaster.entitySelector)}
				getSortValue={(paymaster) => paymaster.entitySelector.address}
				placeholderText="Loading paymasters…"
				items={paymasters.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">No indexed paymasters yet.</p>
				{/snippet}

				{#snippet Item({ item: paymaster })}
					<Erc4337PaymasterView
						selection={paymaster}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
