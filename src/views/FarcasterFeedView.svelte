<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Props
	let {
		children,
		entityId,
		href,
		limit = 50,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.FarcasterFeed>
			href: string
			limit?: number
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
			| 'Heading'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { mountEntityResolveLive } from '$/lib/db/resolveLive.svelte.ts'

	mountEntityResolveLive({
		entityType: EntityType.FarcasterFeed,
		entityId: () => entityId,
	})

	const feed = useEntity(
		EntityType.FarcasterFeed,
		entityId,
		{
			$: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
				Source.Farcaster_Rest,
			],
			label: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterFeed}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={feed}
			placeholderText="Loading feed…"
		>
			{#snippet children(feedRow)}
				<HeadingComponent>
					<a {href}>
						{(
							feedRow.label != null
							&& feedRow.label.trim() !== ''
						) ?
							feedRow.label
						: entityId.variant === 'trending' ?
							'Trending'
						: entityId.variant === 'byUser' ?
							`FID ${String(entityId.fid)}`
						: entityId.variant === 'byChannel' ?
							entityId.channelId
						:
							'Following'
						}
					</a>
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Variant</dt>
				<dd>{entityId.variant}</dd>
			</div>
			{#if entityId.variant === 'byUser'}
				<div>
					<dt>FID</dt>
					<dd>{String(entityId.fid)}</dd>
				</div>
			{:else if entityId.variant === 'byChannel'}
				<div>
					<dt>Channel id</dt>
					<dd>{entityId.channelId}</dd>
				</div>
			{:else if entityId.variant === 'following'}
				<div>
					<dt>Viewer FID</dt>
					<dd>{String(entityId.viewerFid)}</dd>
				</div>
			{/if}
			<ResourceBoundary
				resource={feed}
				placeholderText="Loading feed…"
			>
				{#snippet children(feedRow)}
					{#if feedRow.label != null && feedRow.label.trim() !== ''}
						<div>
							<dt>Label</dt>
							<dd>{feedRow.label}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.FarcasterFeed}
			{entityId}
		/>

		<FarcasterCastsView
			entityFieldReference={{
				entityType: EntityType.FarcasterFeed,
				entityId,
				fieldName: '$$entries',
			}}
			href={href}
			id={`${stringify(entityId)}:entries`}
			{limit}
			open={false}
			title="Feed"
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
