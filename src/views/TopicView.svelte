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
			entityId: EntityId<typeof schema, EntityType.EvmTopic>
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

	const topicQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.EvmTopic] })
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
			topicQuery.data?.find(
				(r) => r.row[EntityMetaKey.Source] === Source.Openchain,
			)?.row
			?? topicQuery.data?.[0]?.row
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
	entityType={EntityType.EvmTopic}
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

	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.EvmTopic}
				{entityId}
			>
				<QueryBoundary
					query={topicQuery}
				>

					{#snippet children(topicRows)}
					{@const topicRow = (
						topicRows?.find(
							(topicRowEnvelope) => topicRowEnvelope.row[EntityMetaKey.Source] === Source.Openchain,
						)?.row
						?? topicRows?.[0]?.row
					)}
					{#if topicRow == null}
						<p data-text="muted">
							No signatures found for this topic.
						</p>
					{:else}
						<section>
							<dl>
								<div>
									<dt>
										Hex (32-byte)
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
												{#each signatures as signature}
													<li><code>{signature}</code></li>
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
