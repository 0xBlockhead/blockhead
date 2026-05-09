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

	const keysResolved = $derived.by(() => {
		if (recordKeysProp !== undefined) {
			return [...recordKeysProp].toSorted((a, b) => (
				((
					ra,
					rb,
				) => (
					ra !== rb ?
						ra - rb
					:	a.localeCompare(b)
				))(
					a in ensTextRecordDisplayRank ?
						ensTextRecordDisplayRank[a]
					:	9999,
					b in ensTextRecordDisplayRank ?
						ensTextRecordDisplayRank[b]
					:	9999,
				)
			))
		}
		const rows = ensRowsQuery.data?.map((item) => item.row) ?? []
		const vRaw = rows.find((r) => r[EntityMetaKey.Source] === Source.Voltaire_JsonRpc)?.[EntityMetaKey.Fields]
		const v = (typeof vRaw === 'object' && vRaw !== null && !Array.isArray(vRaw)) ? vRaw : undefined
		const gRaw = rows.find((r) => r[EntityMetaKey.Source] === Source.TheGraph_Graphql)?.[EntityMetaKey.Fields]
		const g = (typeof gRaw === 'object' && gRaw !== null && !Array.isArray(gRaw)) ? gRaw : undefined
		const fromLive = (
			v !== undefined
			&& typeof v.textRecords === 'object'
			&& v.textRecords !== null
			&& !Array.isArray(v.textRecords) ?
				Object.entries(v.textRecords).flatMap(([k, val]) => (
					typeof val === 'string' ?
						[k]
					:	[]
				))
			:	[]
		)
		const fromIndex = (
			Array.isArray(g?.resolverTextKeys) ?
				g.resolverTextKeys.filter((x): x is string => typeof x === 'string')
			:	[]
		)
		return [...new Set([...fromLive, ...fromIndex])].toSorted((a, b) => (
			((
				ra,
				rb,
			) => (
				ra !== rb ?
					ra - rb
				:	a.localeCompare(b)
			))(
				a in ensTextRecordDisplayRank ?
					ensTextRecordDisplayRank[a]
				:	9999,
				b in ensTextRecordDisplayRank ?
					ensTextRecordDisplayRank[b]
				:	9999,
			)
		))
	})

	const items = $derived(
		new SvelteSet(keysResolved),
	)

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
