<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Allowances',
		open = $bindable(true),
		collapsible = true,
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
			<ResourceBoundary
				resource={selection}
				placeholderText={`Loading ${title.toLowerCase()}…`}
			>
				{#snippet children(allowances)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmActorCoinAllowance}
				{title}
				open={true}
				data-entity-field-name={selection.fieldName}
				data-entity-field-type={selection.entityType}
				data-entity-field-parent={stringify(selection.entitySelector)}
				getKey={(allowance) => stringify(allowance.entitySelector)}
				getSortValue={(allowance) => stringify(allowance.entitySelector)}
				placeholderKeys={new SvelteSet<string>()}
				placeholderText={`Loading ${title.toLowerCase()}…`}
				items={allowances.entities}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No allowances for this wallet yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const id = item.entitySelector}
					<EvmActorCoinAllowanceView
						selector={id}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
