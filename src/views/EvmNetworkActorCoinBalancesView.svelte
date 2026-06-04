<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityFieldReference,
		title = 'Balances',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmNetworkActorCoinBalance>
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = useEntity(
				EntityType._Global,
				{ scope: '$$actors' },
				{
					$: [
						Source.Local_Internal,
					],
					$$actors: {
						$: [
							Source.Local_Internal,
						],
					},
				},
			)}
			{@const actors = derive(
				parent,
				(parent) => {
					const evmAccounts: Entity<typeof schema, EntityType.EvmAccount>[] = (
						parent.$$actors ?? []
					)
					return (
						evmAccounts.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmAccount}
				{title}
				open={true}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				placeholderKeys={new SvelteSet<string>()}
				placeholderText={`Loading ${title.toLowerCase()}…`}
				resource={actors}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No balances yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const id = item.value[EntityMetaKey.Id]}
					<EvmAccountView
						entityId={id}
						layout={EntityLayout.SummaryDetails}
						open={true}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
