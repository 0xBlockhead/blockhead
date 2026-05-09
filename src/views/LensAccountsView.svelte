<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollectionForReference } from '$/collections/$collections.ts'
	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		open = $bindable(true),
		title = 'Accounts',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.LensAccount>
		href: string
		id: string
		open?: boolean
		title?: string
	} = $props()


	const accountsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					accountFieldRow: (
						entityFieldCollectionForReference(
							entityFieldCollections,
							entityFieldReference,
						)
					),
				})
				.where(({ accountFieldRow }) => (
					eq(
						accountFieldRow[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ accountFieldRow }) => (
					eq(
						accountFieldRow[EntityMetaKey.Source],
						Source.Lens_Graphql,
					)
				))
				.select(({ accountFieldRow }) => (
					{ value: accountFieldRow[EntityMetaKey.Value] }
				))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<EntitiesList
	entityType={EntityType.LensAccount}
	{href}
	{id}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => (
		row[EntityMetaKey.Id].address
	)}
	items={accountsQuery.data?.map(({ value }) => value) ?? []}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={{
		data: accountsQuery.data?.map(({ value }) => value) ?? [],
		isLoading: accountsQuery.isLoading,
		isError: accountsQuery.isError,
		isReady: accountsQuery.isReady,
		error: accountsQuery.error,
		status: accountsQuery.status,
	}}
	{title}
>
	{#snippet Empty()}
		<p data-text="muted">
			No Lens accounts to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if item}
			{@const accountId = item[EntityMetaKey.Id]}
			<LensAccountView
				entityId={{ address: accountId.address }}
				href={resolve('/(social)/lens/account/[address]', {
					address: accountId.address,
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
