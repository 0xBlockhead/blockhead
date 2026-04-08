<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Caip>
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
			| 'Summary'
		>
	> = $props()


	const caipIdKey = $derived(
		stringify(entityId),
	)

	const caipQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Caip] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						caipIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => caipIdKey],
	)

	const caipRow = $derived(
		(
			caipQuery.data?.find(
				(r) => r.row[EntityMetaKey.Source] === Source.Caips,
			)?.row
			?? caipQuery.data?.[0]?.row
		)
	)

	const caipField = $derived(
		(() => {
			const bag = caipRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				title: typeof b.title === 'string' && b.title.length ? b.title : undefined,
				number: typeof b.number === 'number' && Number.isFinite(b.number) ? b.number : undefined,
				status: typeof b.status === 'string' && b.status.length ? b.status : undefined,
				type: typeof b.type === 'string' && b.type.length ? b.type : undefined,
				url: typeof b.url === 'string' && b.url.length ? b.url : undefined,
				created: typeof b.created === 'string' && b.created.length ? b.created : undefined,
				body: typeof b.body === 'string' ? b.body : b.body === null ? null : undefined,
			}
		})(),
	)

	const displayTitle = $derived(
		caipField?.title ?? `CAIP-${entityId.id}`,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import CaipsView from '$/views/CaipsView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.Caip}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>CAIP</dt>
				<dd>{entityId.id}</dd>
			</div>
			{#if caipField?.status != null}
				<div>
					<dt>Status</dt>
					<dd>{caipField.status}</dd>
				</div>
			{/if}
			{#if caipField?.type != null}
				<div>
					<dt>Type</dt>
					<dd>{caipField.type}</dd>
				</div>
			{/if}
			{#if caipField?.url != null && caipField.url.startsWith('http')}
				<div>
					<dt>Spec</dt>
					<dd>
						<a
							href={caipField.url}
							rel="noreferrer noopener"
							target="_blank"
						>
							View on caip.co
						</a>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Caip}
			{entityId}
		>
			<QueryBoundary
				query={caipQuery}
			>

				{#snippet children(rows)}
					{@const caipRow = (
						rows?.find(
							(r) => r.row[EntityMetaKey.Source] === Source.Caips,
						)?.row
						?? rows?.[0]?.row
					)}
					{#if caipRow == null}
						<p data-text="muted">
							No CAIP row in collections yet (resolve Caips GitHub for this id).
						</p>
					{:else}
						<dl>
							{#if caipField?.number != null}
								<div>
									<dt>Number</dt>
									<dd>{String(caipField.number)}</dd>
								</div>
							{/if}
							{#if caipField?.created != null}
								<div>
									<dt>Created</dt>
									<dd>{caipField.created}</dd>
								</div>
							{/if}
						</dl>

						{#if caipField?.body != null && caipField.body.length > 0}
							<article data-caip-body>
								{caipField.body}
							</article>
						{:else}
							<p data-text="muted">
								No markdown body in this row (list catalog may omit bodies).
							</p>
						{/if}
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<CaipsView
			href={resolve('/proposals/caips')}
			id={`${caipIdKey}:caips`}
			open={false}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>


<style>
	article[data-caip-body] {
		white-space: pre-wrap;
		font-size: 0.9em;
	}
</style>
