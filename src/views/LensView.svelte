<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(lens)/lens'),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LensNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const networkIdKey = stringify(entityId)

	const lensNetwork = useEntity(
		EntityType.LensNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			protocolName: {},
			registryLabel: {},
			...(open ?
				{
					homeUrl: {},
					docsUrl: {},
					topology: {},
					$$lensAccounts: {
						$: [
							Source.Constants_Internal,
							Source.Lens_Graphql,
							Source.Lens_HeyGraphql,
						],
					},
					$$lensPosts: {
						$: [
							Source.Lens_Graphql,
							Source.Lens_HeyGraphql,
						],
					},
				}
			:
				{}),
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LensAccountsView from '$/views/LensAccountsView.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<EntityView
	entityType={EntityType.LensNetwork}
	{entityId}
	href={href}
	layout={EntityLayout.SummaryDetails}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="Lens"
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Lens v3 separates publisher profiles (addresses and account metadata) from publications surfaced here as posts and reposts.
		</p>
		<p>
			Counts here reflect the Graph-backed slice wired for this app; they index protocol activity the resolver exposes, not an exhaustive offline mirror of Lens.
		</p>
	{/snippet}

	{#snippet Value()}
		{entityId.scope}
	{/snippet}

	{#snippet Title()}
		Lens
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={lensNetwork}
			placeholderText="Loading Lens…"
		>
			{#snippet children(lensNetwork)}
				{lensNetwork.protocolName ?? 'Lens'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={lensNetwork}
				placeholderText="Loading Lens…"
			>
				{#snippet children(lensNetwork)}
					{#if lensNetwork.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{lensNetwork.registryLabel}</dd>
						</div>
					{:else if lensNetwork.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{lensNetwork.protocolName}</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>Profiles</dt>
							<dd>{String(lensNetwork.$$lensAccounts?.length ?? 0)}</dd>
						</div>
						<div>
							<dt>Publications</dt>
							<dd>{String(lensNetwork.$$lensPosts?.length ?? 0)}</dd>
						</div>

						{#if lensNetwork.topology}
							<div>
								<dt>Topology</dt>
								<dd>{lensNetwork.topology}</dd>
							</div>
						{/if}

						{#if lensNetwork.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={lensNetwork.homeUrl}>{lensNetwork.homeUrl}</a>
								</dd>
							</div>
						{/if}

						{#if lensNetwork.docsUrl !== undefined}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={lensNetwork.docsUrl}>
										{lensNetwork.docsUrl}
									</a>
								</dd>
							</div>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
				id={`${networkIdKey}:carousel-registry`}
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'registry-accounts', label: 'Profiles' },
					{ id: 'registry-posts', label: 'Publications' },
					{ id: 'examples-list', label: 'Examples' },
				] as const}
				data-card
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Directory & examples
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRegistryAccounts()}
					<LensAccountsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/lens/accounts')}
						entityFieldReference={{
							entityType: EntityType.LensNetwork,
							entityId,
							fieldName: '$$lensAccounts',
						}}
						id={`${networkIdKey}:accounts`}
						open={_open}
					/>
				{/snippet}

				{#snippet SectionRegistryPosts()}
					<LensPostsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/lens/posts')}
						entityFieldReference={{
							entityType: EntityType.LensNetwork,
							entityId,
							fieldName: '$$lensPosts',
						}}
						id={`${networkIdKey}:posts`}
						open={_open}
						title="Recent Lens v3 publications"
					/>
				{/snippet}

				{#snippet SectionExamplesList()}
					<ul>
						<li>
							<a href={resolve('/(social)/lens/account/[address]', {
								address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
							})}>
								Lens v3 profile example
							</a>
						</li>
						<li>
							<a href={resolve('/(social)/(lens)/lens/posts')}>
								Browse recent publications
							</a>
						</li>
					</ul>
				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
