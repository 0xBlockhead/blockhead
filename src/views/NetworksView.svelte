<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { entityFieldCollections } from '$/data/collections/entityFieldCollections.ts'
	import { sourcesForEntityFieldLiveQuery } from '$/data/tanstackDb/entityQuerySources.ts'
	import { serializeEntityId } from '$/schema/$entityId.ts'
	import { entityCollectionRow } from '$/schema/$EntityCollectionRow.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { inArray, useLiveQuery } from '@tanstack/svelte-db'


	// Props
	let {
		title = 'Networks',

		open = $bindable(true),

		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// (Derived)
	const networksLiveQuery = useLiveQuery((q) => (
		q
			.from({
				row: entityFieldCollections[EntityType._Global]['$$networks'],
			})
			.where(({ row }) =>
				inArray(
					row[entityCollectionRow.source],
					sourcesForEntityFieldLiveQuery(EntityType._Global, '$$networks'),
				),
			)
			.select(({ row: networkRow }) => networkRow)
	))

	const listLoading = $derived(networksLiveQuery.isLoading)
	const listError = $derived(networksLiveQuery.isError)

	const networkChainIdFromRow = (networkRow: object) => {
		const rowRecord = networkRow as Record<string, unknown>
		const idPart = rowRecord.$id
		if (
			typeof idPart !== 'object' ||
			idPart == null ||
			Array.isArray(idPart)
		)
			return null
		const chainId = (idPart as { chainId?: unknown }).chainId
		return typeof chainId === 'number' ? chainId : null
	}

	const networkRowKey = (
		networkRow: object,
		networkIndex: number,
	) => {
		const rowRecord = networkRow as Record<string, unknown>
		const src = rowRecord[entityCollectionRow.source]
		const chainId = networkChainIdFromRow(networkRow)
		return (
			chainId != null ?
				`${String(src ?? '')}\0${serializeEntityId({ chainId })}`
			:	`invalid-network-${networkIndex}`
		)
	}


	// Components
	import Boundary from '$/components/Boundary.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
</script>


<EntitiesList
	entityType={EntityType.Network}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet body()}
		<Boundary>
			{#snippet Failed(error, _retry)}
				<p role="alert">
					{String(error)}
				</p>
			{/snippet}

			{#if listLoading}
				<p data-text="muted">
					Loading networks…
				</p>
			{:else if listError}
				<p role="alert">
					Could not load networks.
				</p>
			{:else}
				<ul data-list>
					{#each (networksLiveQuery.data ?? []) as networkRow, networkIndex (networkRowKey(networkRow, networkIndex))}
						{@const chainId = networkChainIdFromRow(networkRow)}
						{#if chainId != null}
							<li>
								<a
									href={resolve('/(explore)/(networks)/network/[networkId]', {
										networkId: String(chainId),
									})}
								>
									{String((networkRow as Record<string, unknown>).name ?? 'Unknown')}
									<span data-text="muted">
										(chain {chainId})
									</span>
								</a>
							</li>
						{/if}
					{/each}
				</ul>
			{/if}
		</Boundary>
	{/snippet}
</EntitiesList>
