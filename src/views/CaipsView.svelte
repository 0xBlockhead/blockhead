<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	import { stringify } from 'devalue'

	const rowEntityId = (row: { [EntityMetaKey.Id]: unknown }) => row[EntityMetaKey.Id]

	const caipRowSortKey = (row: { [EntityMetaKey.Id]: unknown }) => {
		const caipId = rowEntityId(row)
		return (
			typeof caipId === 'object'
			&& caipId != null
			&& 'id' in caipId
			&& typeof caipId.id === 'string' ?
				caipId.id
			:
				''
		)
	}


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/collections/$collections.ts'


	// Props
	let {
		id = 'caips',
		href = resolve('/proposals/caips'),
		title = 'CAIPs',

		open = $bindable(true),

		...EntitiesListProps
	}: WithRest<
		{
			id?: string
			href?: string
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const globalParentKey = stringify({})

	const caipsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$caips: entityFieldCollections[EntityType._Global]['$$caips']! })
				.where(({ $$caips }) => (
					eq(
						$$caips[EntityMetaKey.ParentIdKey],
						globalParentKey,
					)
				))
				.where(({ $$caips }) => (
					eq(
						$$caips[EntityMetaKey.Source],
						Source.Caips,
					)
				))
				.select(({ $$caips }) => ({
					[EntityMetaKey.Id]: $$caips[EntityMetaKey.Value][EntityMetaKey.Id],
				}))
		),
		[],
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CaipView from '$/views/CaipView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Caip}
	{id}
	{href}
	{title}
	bind:open
	query={caipsQuery}
	items={new SvelteSet(caipsQuery.data ?? [])}
	getKey={(row) => stringify(row[EntityMetaKey.Id]) ?? ''}
	getSortValue={caipRowSortKey}
	placeholderKeys={new SvelteSet()}
	unorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			No CAIPs in collections (resolve GitHub CAIPs catalog).
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const caipId = rowEntityId(row)}
			{#if typeof caipId === 'object' && caipId != null && 'id' in caipId && typeof caipId.id === 'string' && caipId.id.length}
				<CaipView
					entityId={{ id: caipId.id }}
					href={resolve('/(explore)/(proposals)/proposals/caip/[caipId]', {
						caipId: caipId.id,
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
