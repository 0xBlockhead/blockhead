<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
		title = 'Allowances',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmActorCoinAllowance>
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
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmActorCoinAllowance}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			ERC-20 token approvals (allowances) give a spender permission to transfer up to a
			specified amount of a token on the owner's behalf.
		</p>
		<p>
			Explorers do not index every historical <code>Approval</code> event, so allowances
			must be checked on-chain per token-spender pair when the spender address is known.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No allowances indexed for this wallet yet. Check individual token-spender pairs via an execution RPC.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {},
				},
			)}
			{@const allowances = derive(
				parent,
				(parent) => {
					const evmActorCoinAllowances: Entity<typeof schema, EntityType.EvmActorCoinAllowance>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						evmActorCoinAllowances.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmActorCoinAllowance}
				{title}
				open={true}
				data-entity-field-name={entityFieldReference.fieldName}
				data-entity-field-type={entityFieldReference.entityType}
				data-entity-field-parent={stringify(entityFieldReference.entityId)}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				placeholderKeys={new SvelteSet<string>()}
				placeholderText={`Loading ${title.toLowerCase()}…`}
				resource={allowances}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No allowances for this wallet yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const id = item.value[EntityMetaKey.Id]}
					<EvmActorCoinAllowanceView
						entityId={id}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
