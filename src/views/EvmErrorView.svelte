<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'

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
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
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

	const signatures = $derived(
		(() => {
			const fields = (
				evmErrorQuery.data?.find(
					(r) => r.row[EntityMetaKey.Source] === Source.Openchain_Rest,
				)?.row
				?? evmErrorQuery.data?.[0]?.row
			)?.[EntityMetaKey.Fields]
			return (
				fields !== undefined
				&& typeof fields === 'object'
				&& 'signatures' in fields
				&& Array.isArray(fields.signatures) ?
					fields.signatures.filter((x): x is string => typeof x === 'string')
				: undefined
			)
		})(),
	)

	const label = $derived(
		signatures !== undefined && signatures.length > 0 ?
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
	{#snippet Content()}
		<dl>
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
							(r) => r.row[EntityMetaKey.Source] === Source.Openchain_Rest,
						)?.row
						?? rows?.[0]?.row
					)}
					{#if row === undefined}
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
										{#if signatures !== undefined && signatures.length > 0}
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
