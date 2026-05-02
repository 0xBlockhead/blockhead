<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import {
		ensTextRecordDisplayRank,
		getEnsTextRecordLabel,
	} from '$/constants/Ens.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		recordKeys: recordKeysProp,
	}: {
		entityId: EntityId<typeof schema, EntityType.EnsName>
		href: string
		open?: boolean
		recordKeys?: string[]
	} = $props()


	const ensNameIdKey = $derived(
		stringify(entityId),
	)

	const ensRowsQuery = useLiveQuery(
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

	const parseTextRecordKeys = (raw: unknown) => {
		if (
			raw === undefined
			|| typeof raw !== 'object'
			|| Array.isArray(raw)
		) return [] as string[]
		return Object.keys(raw as Record<string, unknown>).filter((k) => (
			typeof (raw as Record<string, unknown>)[k] === 'string'
		))
	}

	const stringListFromBag = (raw: unknown) => (
		Array.isArray(raw) ?
			raw.filter((x): x is string => typeof x === 'string')
		:	[]
	)

	const textRecordRank = (key: string) => (
		key in ensTextRecordDisplayRank ?
			ensTextRecordDisplayRank[key as keyof typeof ensTextRecordDisplayRank]
		:	9999
	)

	const sortKeys = (keys: string[]) => (
		[...keys].toSorted((a, b) => (
			(() => {
				const ra = textRecordRank(a)
				const rb = textRecordRank(b)
				return ra !== rb ?
						ra - rb
					:	a.localeCompare(b)
			})()
		))
	)

	const keysResolved = $derived.by(() => {
		if (recordKeysProp !== undefined) return sortKeys(recordKeysProp)
		const rows = ensRowsQuery.data?.map((item) => item.row) ?? []
		const v = rows.find((r) => r[EntityMetaKey.Source] === Source.Voltaire_JsonRpc)
			?.[EntityMetaKey.Fields] as Record<string, unknown> | undefined
		const g = rows.find((r) => r[EntityMetaKey.Source] === Source.TheGraph_Graphql)
			?.[EntityMetaKey.Fields] as Record<string, unknown> | undefined
		const fromLive = parseTextRecordKeys(v?.textRecords)
		const fromIndex = stringListFromBag(g?.resolverTextKeys)
		const merged = [...new Set([...fromLive, ...fromIndex])]
		return sortKeys(merged)
	})

	const items = $derived.by(() => {
		const s = new SvelteSet<string>()
		for (const k of keysResolved) s.add(k)
		return s
	})

	const placeholderKeys = new SvelteSet<string>()

	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	title="Text records"
	{href}
	{open}
>
	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.EnsName}
			{entityId}
		>
			<UnorderedList
				{items}
				getKey={(k) => k}
				getSortValue={(k) => k}
				{placeholderKeys}
			>
				{#snippet Item(
					props,
				)}
					{#if props.isPlaceholder}
						<span aria-hidden="true"></span>
					{:else}
						{@const recordLabel = getEnsTextRecordLabel(props.item)}
						<a
							data-link
							href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/(records)/record/[recordId]', {
								ensName: entityId.name,
								recordId: props.item,
							})}
						>
							{recordLabel}
							{#if recordLabel !== props.item}
								<small data-text="muted"> ({props.item})</small>
							{/if}
						</a>
					{/if}
				{/snippet}

				{#snippet Empty()}
					<p data-text="muted">No text records yet.</p>
				{/snippet}
			</UnorderedList>
		</EntityDetails>
	{/snippet}
</EntityView>
