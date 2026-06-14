<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'ERC-4337 paymasters',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Erc4337Paymaster>
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const network = subscribe(EntityType.EvmNetwork,
				entityFieldReference.selector,
				({ fields: { $$erc4337Paymasters: ({ sources: [
							Source.Blockscout_Rest,
						], limit: 16 }) } }),
			)}
			{@const paymasters = derive(
				network,
				(network): readonly Entity<typeof schema, EntityType.Erc4337Paymaster>[] => (
					(network.fields.$$erc4337Paymasters?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Erc4337Paymaster}
				id={`${id}-items`}
				href={href}
				getKey={(paymaster) => stringify(paymaster[EntityMetaKey.Selector])}
				getSortValue={(paymaster) => paymaster[EntityMetaKey.Selector].address}
				placeholderText="Loading paymasters…"
				resource={paymasters}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">No indexed paymasters yet.</p>
				{/snippet}

				{#snippet Item({ item: paymaster })}
					<Erc4337PaymasterView
						selector={paymaster[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
