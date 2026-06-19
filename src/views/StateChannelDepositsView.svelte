<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		selection,
		title = 'Deposits',
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.StateChannelDeposit>
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
	import StateChannelDepositView from '$/views/StateChannelDepositView.svelte'
</script>


<EntitiesList
	entityType={EntityType.StateChannelDeposit}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Per-participant collateral stateChannelDeposits tracked for this channel’s funding ledger.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No deposit stateChannelDeposits on this channel yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [Source.Local_Internal],
				})} placeholderText="Loading channel deposits…">
				{#snippet children(deposits)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.StateChannelDeposit}
						getKey={(item) => stringify(item.entitySelector)}
						getSortValue={(item) => stringify(item.entitySelector)}
						{title}
						href={EntitiesListProps.href ?? ''}
						id={`${EntitiesListProps.id ?? 'channel-deposits'}:items`}
						items={deposits.entities}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No deposit stateChannelDeposits on this channel yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<StateChannelDepositView
								selection={select(EntityType.StateChannelDeposit, item.entitySelector)}
								layout={EntityLayout.Summary}

								collapsible={false}
								showTypeAnnotation={false}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
