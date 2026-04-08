<script lang="ts">
	// Types/constants
	import {
		type EntityId,
		schema,
	} from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'


	// State
	import type { Snippet } from 'svelte'
	import type { EntityViewProps } from '$/typescript/EntityViewProps.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'

	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmError>
			href: string
			open?: boolean
		},
		Omit<
			EntityViewProps,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Summary'
		>
	> = $props()


	const idKey = $derived(
		stringify(entityId),
	)

	const evmErrorQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.EvmError] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						idKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => idKey],
	)

	const row = $derived(
		(
			evmErrorQuery.data?.find(
				(r) => r.row[EntityMetaKey.Source] === Source.Openchain,
			)?.row
			?? evmErrorQuery.data?.[0]?.row
		)
	)

	const fieldBag = $derived(
		row?.[EntityMetaKey.Fields],
	)

	const signatures = $derived(
		(
			fieldBag != null
			&& typeof fieldBag === 'object'
			&& 'signatures' in fieldBag
			&& Array.isArray(fieldBag.signatures)
		) ?
			fieldBag.signatures.filter((x): x is string => typeof x === 'string')
		:
			undefined,
	)

	const label = $derived(
		signatures != null && signatures.length > 0 ?
			signatures[0]!
		:
			entityId.hex,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmError}
	{entityId}
	title={label}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Hex</dt>
				<dd>{entityId.hex}</dd>
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
				entityType={EntityType.EvmError}
				{entityId}
			>
				<QueryBoundary
					query={evmErrorQuery}
				>

					{#snippet children(rows)}
					{@const row = (
						rows?.find(
							(r) => r.row[EntityMetaKey.Source] === Source.Openchain,
						)?.row
						?? rows?.[0]?.row
					)}
					{#if row == null}
						<p data-text="muted">
							No signatures found for this error selector.
						</p>
					{:else}
						<section>
							<dl>
								<div>
									<dt>
										Hex (4-byte)
									</dt>
									<dd><code>{entityId.hex}</code></dd>
								</div>

								<div>
									<dt>
										Signatures
									</dt>
									<dd>
										{#if signatures != null && signatures.length > 0}
											<ul>
												{#each signatures as sig}
													<li><code>{sig}</code></li>
												{/each}
											</ul>
										{:else}
											—
										{/if}
									</dd>
								</div>
							</dl>
						</section>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
