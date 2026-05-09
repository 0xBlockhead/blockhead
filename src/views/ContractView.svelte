<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		entityId,
		title = 'Contract',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmContract>
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()

	const contractIdKey = $derived(
		stringify(entityId),
	)

	const contractQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.EvmContract] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						contractIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => contractIdKey],
	)

	const contractRow = $derived(
		contractQuery.data?.[0]?.row,
	)

	const contractField = $derived(
		(() => {
			const bag = contractRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const b = bag
			return {
				abi: typeof b.abi === 'string' && b.abi.length ? b.abi : undefined,
			}
		})(),
	)


	// Components
	import Address from '$/views/Address.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContract}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Address</dt>
				<dd>
					<Address
						network={entityId.$network}
						address={entityId.address}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.EvmContract}
				{entityId}
			>
				<QueryBoundary
					query={contractQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No contract data for this address yet.
						</p>
					{:else}
						<dl>
							{#if contractField?.abi !== undefined}
								<div>
									<dt>ABI</dt>
									<dd>
										<TruncatedValue
											value={contractField.abi}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}
						</dl>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
