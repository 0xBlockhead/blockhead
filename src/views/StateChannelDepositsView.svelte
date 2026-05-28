<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityFieldReference,
		title = 'Deposits',
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.StateChannelDeposit
			>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			Per-participant collateral rows tracked for this channel’s funding ledger.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No deposit rows on this channel yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [Source.Local_Internal],
					},
				},
			)}
			{@const deposits = derive(
				parent,
				(parent) => (
					[...(parent[entityFieldReference.fieldName] ?? [])]
						.map((value) => ({
							value,
						}))
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.StateChannelDeposit}
				getKey={(line) => stringify(line.value[EntityMetaKey.Id])}
				getSortValue={(line) => (
					stringify(line.value[EntityMetaKey.Id])
				)}
				placeholderText="Loading channel deposits…"
				resource={deposits}
				{title}
				href={EntitiesListProps.href ?? ''}
				id={`${EntitiesListProps.id ?? 'channel-deposits'}:items`}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No deposit rows on this channel yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const line = item.value}
					{@const depositId = line[EntityMetaKey.Id]}
					<StateChannelDepositView
						entityId={depositId}
						layout={EntityLayout.Summary}
						open={false}
						collapsible={false}
						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
