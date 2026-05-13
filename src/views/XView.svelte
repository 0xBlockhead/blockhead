<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	const entityId = {
		scope: 'XNetwork' as const,
	}

	const exampleUserId = '783214' as const
	const examplePostId = '1955274825074221427' as const

	const networkIdKey = stringify(entityId)

	const network = useEntity(
		EntityType.XNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			protocolName: {},
			homeUrl: {},
			docsUrl: {},
			$$xUsers: {},
			$$xPosts: {},
		},
	)


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
	import XUsersView from '$/views/XUsersView.svelte'
</script>


<EntityView
	entityType={EntityType.XNetwork}
	{entityId}
	href={resolve('/(social)/x')}
	open={true}
	title="X"
>
	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Scope</dt>
				<dd>{entityId.scope}</dd>
			</div>
			<ResourceBoundary
				resource={network}
				placeholderText="Loading X network…"
			>
				{#snippet children(loaded)}
					<div>
						<dt>Users</dt>
						<dd>{String(loaded['$$xUsers'].length)}</dd>
					</div>
					<div>
						<dt>Posts</dt>
						<dd>{String(loaded['$$xPosts'].length)}</dd>
					</div>
					{#if open}
						<div>
							<dt>Protocol name</dt>
							<dd>{loaded.protocolName}</dd>
						</div>
					{/if}
					{#if open}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={loaded.homeUrl}>
									{loaded.homeUrl}
								</a>
							</dd>
						</div>
					{/if}
					{#if open}
						{#if loaded.docsUrl != null}
							{#if loaded.docsUrl !== ''}
								<div>
									<dt>Docs</dt>
									<dd>
										<a href={loaded.docsUrl}>
											{loaded.docsUrl}
										</a>
									</dd>
								</div>
							{/if}
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.XNetwork}
			{entityId}
		/>

		<div data-column="gap-3">
			<Collapsible
				id={`${networkIdKey}:registry`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Recent search
						</HeadingComponent>
					</header>
				{/snippet}

				<div
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
					style="--carousel-basis: 36ch"
				>
					<section data-scroll-marker-label="Users">
						<XUsersView
							entityFieldReference={{
								entityType: EntityType.XNetwork,
								entityId,
								fieldName: '$$xUsers',
							}}
							href={resolve('/(social)/x')}
							id={`${networkIdKey}:users`}
							open={false}
						/>
					</section>

					<section data-scroll-marker-label="Recent posts">
						<XPostsView
							entityFieldReference={{
								entityType: EntityType.XNetwork,
								entityId,
								fieldName: '$$xPosts',
							}}
							href={resolve('/(social)/x')}
							id={`${networkIdKey}:posts`}
							open={false}
							title="Recent posts"
						/>
					</section>
				</div>
			</Collapsible>

			<Collapsible
				id={`${networkIdKey}:examples`}
				open={true}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Examples
						</HeadingComponent>
					</header>
				{/snippet}

				<p data-text="muted">
					Set
					<code>PUBLIC_X_API_BEARER</code>
					to enable the source.
				</p>
				<ul>
					<li>
						<a href={resolve('/(social)/x/user/[userId]', {
							userId: encodeURIComponent(exampleUserId),
						})}>
							Example user
						</a>
					</li>
					<li>
						<a href={resolve('/(social)/x/post/[postId]', {
							postId: examplePostId,
						})}>
							Example post
						</a>
					</li>
				</ul>
			</Collapsible>
		</div>
	{/snippet}
</EntityView>
