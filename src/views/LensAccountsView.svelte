<script lang="ts">
	// Types/constants
	import { type EntityFieldReference } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		open = $bindable(true),
		title = 'Accounts',
	}: {
		entityFieldReference: EntityFieldReference<typeof EntityType.LensAccount>
		href: string
		id: string
		open?: boolean
		title?: string
	} = $props()


	const accountsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					accountFieldRow: entityFieldCollections[EntityType.LensNetwork]['$$lensAccounts']!,
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
				.select(({ accountFieldRow }) => ({
					[EntityMetaKey.Id]: (
						// @ts-expect-error entity field row stores target id
						accountFieldRow[EntityMetaKey.Value]![EntityMetaKey.Id]
					),
				}))
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
		typeof row[EntityMetaKey.Id] === 'object'
		&& row[EntityMetaKey.Id] !== undefined
		&& 'address' in row[EntityMetaKey.Id]
		&& typeof row[EntityMetaKey.Id].address === 'string' ?
			row[EntityMetaKey.Id].address
		:	''
	)}
	items={new SvelteSet(accountsQuery.data ?? [])}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={accountsQuery}
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
			{#if typeof accountId === 'object' && accountId !== undefined && 'address' in accountId && typeof accountId.address === 'string'}
				<LensAccountView
					entityId={{ address: accountId.address }}
					href={resolve('/(social)/lens/account/[address]', {
						address: accountId.address,
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
