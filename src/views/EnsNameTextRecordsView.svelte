<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import {
		ensTextRecordDisplayRank,
		getEnsTextRecordLabel,
	} from '$/constants/Ens.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'


	// Props
	let {
		entityId,
		href,
		id = 'ens-text-records',
		open = $bindable(true),
		recordKeys: recordKeysProp,
		title = 'Text records',
		...entitiesListRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EnsName>
			href: string
			id?: string
			open?: boolean
			recordKeys?: string[]
			title?: string
		},
		Omit<ComponentProps<typeof EntitiesList>, 'entityType'>
	> = $props()


	// State
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const ens = useEntity(
		EntityType.EnsName,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
				Source.TheGraph_Graphql,
			],
			textRecords: {},
			resolverTextKeys: {},
		},
	)

	const rank = (key: string) => (
		key in ensTextRecordDisplayRank ?
			ensTextRecordDisplayRank[key]
		:
			9999
	)

	const textRecordKeys = derive(ens, (row) => (
		recordKeysProp !== undefined ?
			[...recordKeysProp].toSorted((a, b) => (
				rank(a) !== rank(b) ?
					rank(a) - rank(b)
				:	a.localeCompare(b)
			))
		:
			[
				...new Set([
					...(
						row.textRecords === undefined ?
							[]
						:
							Object.keys(row.textRecords)
					),
					...(row.resolverTextKeys ?? []),
				]),
			].toSorted((a, b) => (
				rank(a) !== rank(b) ?
					rank(a) - rank(b)
				:	a.localeCompare(b)
			))
	))
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.EnsName}
	getKey={(key) => key}
	getSortValue={(key) => (
		`${String(rank(key)).padStart(4, '0')}:${key}`
	)}
	{href}
	{id}
	placeholderKeys={new SvelteSet()}
	resource={textRecordKeys}
	{title}
>
	{#snippet Empty()}
		<p data-text="muted">
			No text records yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
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
</EntitiesList>
