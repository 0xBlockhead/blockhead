<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		ensTextRecordDisplayRank,
		ensTextRecordLabelByKey,
	} from '$/constants/Ens.ts'

	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		id = 'ens-text-records',
		open = $bindable(true),
		collapsible = true,
		excludeRecordKeys: excludeRecordKeysProp,
		recordKeys: recordKeysProp,
		title = 'Text records',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EnsName>
			id?: string
			open?: boolean
			excludeRecordKeys?: readonly string[]
			recordKeys?: string[]
			title?: string
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()



	// Functions
	const rank = (key: string) => (
		Object
			.values(ensTextRecordDisplayRank)
			.find((row) => row.key === key)
			?.rank
		?? 9999
	)


	const ens = $derived(
		selection({
				sources: [
					Source.Voltaire_JsonRpc,
					Source.TheGraph_Graphql,
				],
				fields: {
					textRecords: true,
					...(open ?
						{ resolverTextKeys: true }
					:
						{}
					),
				},
			}
		)
	)


	// (Derived)
	const excludeRecordKeys = $derived(
		excludeRecordKeysProp === undefined ?
			null
		:
			new SvelteSet(excludeRecordKeysProp)
	)

	


	// Components
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<div data-column="gap-3">
	<ResourceBoundary
		resource={ens}
		placeholderText="Loading ENS text records…"
	>
		{#snippet children(ens)}
			<EntitiesList
				{...EntitiesListProps}
				bind:open
				entityType={EntityType.EnsName}
				getKey={(key) => key}
				getSortValue={(key) => (
					`${String(rank(key)).padStart(4, '0')}:${key}`
				)}
				{id}
				items={(recordKeysProp !== undefined ?
					[...recordKeysProp]
				:
					[...new Set([
						...(ens.fields.textRecords === undefined ?
							[]
						:
							Object.keys(ens.fields.textRecords)),
							...ens.fields.resolverTextKeys.values,
					])]
				).filter((key) => (
					excludeRecordKeys == null
					|| !excludeRecordKeys.has(key)
				))}
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

				{#snippet Item({ item })}
					{@const recordLabel = (
						item in ensTextRecordLabelByKey ?
							ensTextRecordLabelByKey[item].label
						:
							item
					)}
					{@const recordValue = ens.fields.textRecords?.[item]}
					<a
						data-link
						href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/(records)/record/[recordId]', {
							ensName: selection.entitySelector.name,
							recordId: item,
						})}
					>
						<span data-column>
							<span>
								{recordLabel}
								{#if recordLabel !== item}
									<small data-text="muted"> ({item})</small>
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
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
</div>
