<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'


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
			| 'Heading'
			| 'Details'
			| 'Icon'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const user = useEntity(
		EntityType.XUser,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.XUser]?.map((r) => r.source)
				?? [Source.Local_Internal]
			),
			username: {},
			name: {},
			description: {},
			$icon: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary, { Layout } from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.XUser}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading user…"
		>
			{#snippet children(row)}
				{row.name ?? row.username ?? entityId.id}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading user…"
		>
			{#snippet children(row)}
				{#if row.$icon !== undefined}
					<IconComponent
						alt={row.name ?? row.username ?? ''}
						shape={IconShape.Circle}
						src={row.$icon[EntityMetaKey.Id].url}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading user…"
		>
			{#snippet children(row)}
				{#if (
					row.username !== undefined
					&& row.username !== (
						row.name ?? row.username ?? entityId.id
					)
				)}
					<span data-text="muted">
						@{row.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open })}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading user…"
		>
			{#snippet children(row)}
				{#if row.description}
					{#if !open}
						<p data-text="muted">
							{row.description}
						</p>
					{/if}
				{/if}
				<dl data-column-item="center">
					<div>
						<dt>User id</dt>
						<dd data-text="mono">
							{@render Id()}
						</dd>
					</div>
					{#if open}
						{#if row.name}
							<div>
								<dt>Name</dt>
								<dd>{row.name}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if row.username}
							<div>
								<dt>Username</dt>
								<dd>{row.username}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if row.description}
							<div>
								<dt>Description</dt>
								<dd>{row.description}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.XUser}
			{entityId}
		>
			<ResourceBoundary
				resource={user}
				placeholderText="Loading user…"
			>
				{#snippet children(row)}
					{#if (
						row.name === undefined
						&& row.username === undefined
						&& row.description === undefined
						&& row.$icon === undefined
					)}
						<p data-text="muted">
							User details are not available yet.
						</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>
	{/snippet}
</EntityView>
