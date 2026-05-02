<script lang="ts">
	// Types/constants
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'

	const entityId = {
		scope: 'XmtpNetwork' as const,
	}


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'

	const networkIdKey = stringify(entityId)

	const networkQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.XmtpNetwork] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						networkIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[],
	)

	const accountsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityFieldCollections[EntityType._Global]['$$actors']! })
				.select(({ row }) => ({ row }))
		),
		[],
	)

	const conversationsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityFieldCollections[EntityType._Global]['$$xmtpConversations']! })
				.select(({ row }) => ({ row }))
		),
		[],
	)

	const networkFields = $derived.by(() => {
		const bag = networkQuery.data?.[0]?.row?.[EntityMetaKey.Fields]
		return bag !== undefined && typeof bag === 'object' ? bag as Record<string, unknown> : null
	})


	// Components
	import ActorsView from '$/views/ActorsView.svelte'
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import XmtpConversationsView from '$/views/XmtpConversationsView.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpNetwork}
	{entityId}
	href={resolve('/(social)/xmtp')}
	open={true}
	title="XMTP"
>
	{#snippet Content()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Scope</dt>
				<dd>{entityId.scope}</dd>
			</div>
			<div>
				<dt>Accounts</dt>
				<dd>{String(accountsQuery.data?.length ?? 0)}</dd>
			</div>
			<div>
				<dt>Conversations</dt>
				<dd>{String(conversationsQuery.data?.length ?? 0)}</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.XmtpNetwork}
			{entityId}
		>
			<QueryBoundary
				query={networkQuery}
			>
				{#snippet children(_rows)}
					<dl data-definition-list="vertical">
						<div>
							<dt>Protocol name</dt>
							<dd>{String(networkFields?.protocolName ?? 'XMTP')}</dd>
						</div>
						<div>
							<dt>Home</dt>
							<dd>
								<a href={String(networkFields?.homeUrl ?? '#')}>
									{String(networkFields?.homeUrl ?? '—')}
								</a>
							</dd>
						</div>
						{#if typeof networkFields?.docsUrl === 'string' && networkFields.docsUrl.length}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={networkFields.docsUrl}>
										{networkFields.docsUrl}
									</a>
								</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<div data-column="gap-3">
			<Collapsible
				id={`${networkIdKey}:registry`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Local network state
						</HeadingComponent>
					</header>
				{/snippet}

				<div
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
					style="--carousel-basis: 36ch"
				>
					<section>
						<ActorsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$actors',
							}}
							href={resolve('/(social)/(xmtp)/xmtp/accounts')}
							id={`${networkIdKey}:accounts`}
							open={false}
							title="Accounts"
						/>
					</section>

					<section>
						<XmtpConversationsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$xmtpConversations',
							}}
							href={resolve('/(social)/(xmtp)/xmtp/conversations')}
							id={`${networkIdKey}:conversations`}
							open={false}
						/>
					</section>
				</div>
			</Collapsible>
		</div>
	{/snippet}
</EntityView>
