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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href,
		id = 'ens-text-records',
		open = $bindable(true),
		collapsible = true,
		excludeRecordKeys: excludeRecordKeysProp,
		recordKeys: recordKeysProp,
		title = 'Text records',
		...entitiesListRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EnsName>
			href: string
			id?: string
			open?: boolean
			excludeRecordKeys?: readonly string[]
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
			...(open ? {
				resolverTextKeys: {},
			} : {}),
		},
	)

	const rank = (key: string) => (
		key in ensTextRecordDisplayRank ?
			ensTextRecordDisplayRank[key]
		:
			9999
	)

	const excludeRecordKeys = $derived(
		excludeRecordKeysProp === undefined ?
			null
		:
			new SvelteSet(excludeRecordKeysProp),
	)

	const textRecords = derive(ens, (ens) => (
		recordKeysProp !== undefined ?
			[...recordKeysProp]
				.filter((key) => (
					excludeRecordKeys == null
					|| !excludeRecordKeys.has(key)
				))
				.toSorted((a, b) => (
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
				])
					.filter((key) => (
						excludeRecordKeys == null
						|| !excludeRecordKeys.has(key)
					)),
			].toSorted((a, b) => (
				rank(a) !== rank(b) ?
					rank(a) - rank(b)
				:	a.localeCompare(b)
			))
	))


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<div data-column="gap-3">
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
		resource={textRecords}
		{title}
	>
		{#snippet TypeAnnotationTooltip()}
			<p>
				ENS text records are resolver-stored profile fields (avatar, URL, etc.) keyed by the name’s on-chain node hash.
			</p>
			<p>
				They are not the same as calldata method ids or log event topics—those belong to contract execution and receipts.
			</p>
		{/snippet}
		{#snippet Empty()}
			<p data-text="muted">
				No text record keys yet.
			</p>
		{/snippet}

		{#snippet Item(props)}
			{#if props.item}
				{@const recordLabel = getEnsTextRecordLabel(props.item)}
				{@const recordValue = (
					ens.ready ?
						ens.current.textRecords?.[props.item]
					:
						undefined
				)}
				<a
					data-link
					href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/(records)/record/[recordId]', {
						ensName: entityId.name,
						recordId: props.item,
					})}
				>
					<span data-column>
						<span>
							{recordLabel}
							{#if recordLabel !== props.item}
								<small data-text="muted"> ({props.item})</small>
							{/if}
						</span>
						{#if recordValue != null && recordValue !== ''}
							<TruncatedValue
								value={recordValue}
								format={TruncatedValueFormat.Visual}
							/>
						{/if}
					</span>
				</a>
			{/if}
		{/snippet}
	</EntitiesList>
</div>
