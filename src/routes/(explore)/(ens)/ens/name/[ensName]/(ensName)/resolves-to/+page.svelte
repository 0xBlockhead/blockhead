<script lang="ts">
	// Types/constants
	import type { JsonValue } from '$/typescript/JsonValue.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	let {
		params,
	} = $props()

	const ensNameIdKey = $derived(
		stringify(
			{ name: params.ensName } satisfies EntityId<typeof schema, EntityType.EnsName>,
		),
	)

	const ensNameQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.EnsName] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						ensNameIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => ensNameIdKey],
	)

	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Page from '$/components/Page.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<Page>
	<QueryBoundary
		query={ensNameQuery}
	>
		{#snippet children(rows)}
			{@const resolvedActor = (
				((o) => (
					o != null
					&& o['$network'] != null
					&& typeof o['$network'] === 'object'
					&& typeof o.address === 'string'
					&& o.address.startsWith('0x') ?
						{
							$network: o['$network'] as EntityId<typeof schema, EntityType.Network>,
							address: o.address as `0x${string}`,
						}
					:
						null
				))(
					((r) => (
						r !== undefined && typeof r === 'object' && !Array.isArray(r) ?
							(r as Record<string, JsonValue>)
						:
							null
					))(
						((
							rows
								?.map((item) => item.row)
								.find((row) => row[EntityMetaKey.Source] === Source.Voltaire_JsonRpc)
						)
							?.[EntityMetaKey.Fields] as Record<string, JsonValue> | undefined)?.['$resolvedActor'],
					),
				)
			)}
			{#if resolvedActor != null}
				<section>
					<NetworkView
						entityId={{
							chainId: resolvedActor.$network.chainId,
						}}
						href={resolve('/(explore)/(networks)/network/[networkId]', {
							networkId: String(resolvedActor.$network.chainId),
						})}
						layout={EntityLayout.Summary}
						open={false}
					/>
				</section>

				<ActorView
					entityId={resolvedActor}
					href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
						ensName: params.ensName,
					})}
				/>
			{:else}
				<p data-text="muted">
					No forward resolution on the Voltaire ENS row for <span data-text="font-monospace">{params.ensName}</span> yet.
				</p>
			{/if}
		{/snippet}
	</QueryBoundary>
</Page>
