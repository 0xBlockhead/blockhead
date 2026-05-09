<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { mergeEntityCollectionRowFields } from '$/collections/mergeEntityCollectionRowFields.ts'
	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.XUser>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	const idKey = $derived(stringify(entityId))

	const xUserMergeSourceOrder = [
		Source.X_Rest,
	] as const

	const userQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.XUser] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						idKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => idKey],
	)

	const userFields = $derived(
		mergeEntityCollectionRowFields<EntityType.XUser>(
			userQuery.data,
			xUserMergeSourceOrder,
		),
	)

	const displayTitle = $derived(
		userFields.name
		?? userFields.username
		?? entityId.id,
	)

	const avatarUrl = $derived((
		userFields.$icon?.[EntityMetaKey.Id].url
	))


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
</script>


<EntityView
	entityType={EntityType.XUser}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Icon()}
		{#if avatarUrl !== undefined}
			<IconComponent
				alt={(
					userFields.name
					?? userFields.username
					?? ''
				)}
				shape={IconShape.Circle}
				src={avatarUrl}
			/>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if userFields.username !== undefined && userFields.username !== displayTitle}
			<span data-text="muted">
				@{userFields.username}
			</span>
		{/if}
	{/snippet}

	{#snippet Content()}
		{#if userFields.description}
			<p data-text="muted">
				{userFields.description}
			</p>
		{/if}
		<div data-text="mono muted">
			{entityId.id}
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.XUser}
			{entityId}
		>
			<QueryBoundary
				query={userQuery}
			>
				{#snippet children(xApiUserResultRows)}
					{#if xApiUserResultRows.length === 0}
						<p data-text="muted">
							No user data in the app for this id yet. Try again shortly, or check your X API credentials and
							rate limits.
						</p>
					{:else}
						<dl>
							{#if userFields.name}
								<div>
									<dt>Name</dt>
									<dd>{userFields.name}</dd>
								</div>
							{/if}
							{#if userFields.username}
								<div>
									<dt>Username</dt>
									<dd>{userFields.username}</dd>
								</div>
							{/if}
							{#if userFields.description}
								<div>
									<dt>Description</dt>
									<dd>{userFields.description}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>
	{/snippet}
</EntityView>
