<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import {
		ethereumChainId,
		l2BeatProjectChainIds,
	} from '$/sources/L2Beat/Rest/constants.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify as stringifyId } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'


	let {
		title = 'Networks',

		open = $bindable(true),

		entityFieldReference,

		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Network>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			| 'entityType'
			| 'getKey'
			| 'getSortValue'
			| 'items'
			| 'resource'
			| 'Item'
			| 'body'
		>
	> = $props()


	const fieldName = entityFieldReference.fieldName
	const sortValueByChainId = new Map([
		[ethereumChainId, 0],
		...l2BeatProjectChainIds.map(({ chainId }, index) => [
			chainId,
			index + 1,
		] as const),
	])

	const networksParent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.L2Beat_Rest,
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
			[fieldName]: {
				$limit: 4096,
			},
		},
	)

	const networks = derive(
		networksParent,
		(merged) => {
			const chainIds = new SvelteSet<number>()
			return (
				(
					(
						merged[fieldName as keyof typeof merged]
						?? []
					) as (Entity<typeof schema, EntityType.Network>)[]
				)
					.flatMap((value) => {
						const chainId = value[EntityMetaKey.Id].chainId
						if (chainIds.has(chainId)) return []
						chainIds.add(chainId)
						return [{ value }]
					})
			)
		},
	)
</script>


<EntitiesList
	entityType={EntityType.Network}
	{title}
	bind:open
	getKey={(line) => stringifyId(line.value[EntityMetaKey.Id])}
	getSortValue={(line) => (
		sortValueByChainId.get(line.value[EntityMetaKey.Id].chainId)
		?? Number.MAX_SAFE_INTEGER + line.value[EntityMetaKey.Id].chainId
	)}
	placeholderKeys={new SvelteSet<string | number>()}
	placeholderText="Loading networks…"
	resource={networks}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			No networks to show yet. Check your connection and try again.
		</p>
	{/snippet}

	{#snippet Item({ item: line, isPlaceholder })}
		{#if isPlaceholder === false}
			{@const chainId = line.value[EntityMetaKey.Id].chainId}
			<NetworkView
				entityId={{ chainId }}
				href={resolve('/(explore)/(networks)/network/[networkId]', {
					networkId: String(chainId),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
