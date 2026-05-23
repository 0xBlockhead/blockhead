<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { stringify } from 'devalue'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		open = $bindable(true),
	}: {
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const entityId = (
		{
			scope: 'LensNetwork' as const,
		} satisfies EntityId<typeof schema, EntityType.LensNetwork>
	)

	const networkIdKey = stringify(entityId)

	const lensNetwork = useEntity(
		EntityType.LensNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			protocolName: {},
			homeUrl: {},
			docsUrl: {},
			$$lensAccounts: {},
			$$lensPosts: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LensAccountsView from '$/views/LensAccountsView.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<EntityView
	entityType={EntityType.LensNetwork}
	{entityId}
	href={resolve('/(social)/lens')}
	bind:open
	title="Lens Protocol v3"
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Lens v3 separates publisher profiles (addresses and account metadata) from publications (posts, mirrors, collects) surfaced as distinct entity lists.
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
		{@render Title()}
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={lensNetwork}>
			{#snippet children(lensNetwork)}
				<dl data-column-item="center">
					<div>
						<dt>Profiles</dt>
						<dd>{String(lensNetwork.$$lensAccounts.length)}</dd>
					</div>
					<div>
						<dt>Publications</dt>
						<dd>{String(lensNetwork.$$lensPosts.length)}</dd>
					</div>
					{#if open}
						<div>
							<dt>Protocol name</dt>
							<dd>{lensNetwork.protocolName}</dd>
						</div>
						<div>
							<dt>Home</dt>
							<dd>
								<a href={lensNetwork.homeUrl}>{lensNetwork.homeUrl}</a>
							</dd>
						</div>
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
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.LensNetwork}
			{entityId}
		/>

		<div
			class="lens-network-detail-carousels"
			data-column="gap-3"
			data-carousel-basis="40ch"
		>
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-registry`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Profiles"
						href={`#${networkIdKey}:registry-accounts`}
					>Profiles</a>
					<a
						data-scroll-marker-label="Recent publications"
						href={`#${networkIdKey}:registry-posts`}
					>Publications</a>
					<a
						data-scroll-marker-label="Examples"
						href={`#${networkIdKey}:examples-list`}
					>Examples</a>
				{/snippet}

				{#snippet body({ open: _open })}
					<section
						data-scroll-marker-label="Profiles"
						id={`${networkIdKey}:registry-accounts`}
					>
						<LensAccountsView
							entityFieldReference={{
								entityType: EntityType.LensNetwork,
								entityId,
								fieldName: '$$lensAccounts',
							}}
							href={resolve('/(social)/lens')}
							id={`${networkIdKey}:accounts`}
							open={_open}
						/>
					</section>

					<section
						data-scroll-marker-label="Recent publications"
						id={`${networkIdKey}:registry-posts`}
					>
						<LensPostsView
							entityFieldReference={{
								entityType: EntityType.LensNetwork,
								entityId,
								fieldName: '$$lensPosts',
							}}
							href={resolve('/(social)/lens')}
							id={`${networkIdKey}:posts`}
							open={_open}
							title="Recent Lens v3 publications"
						/>
					</section>

					<section
						data-scroll-marker-label="Examples"
						id={`${networkIdKey}:examples-list`}
					>
						<ul>
							<li>
								<a href={resolve('/(social)/lens/account/[address]', {
									address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
								})}>
									Lens v3 profile example
								</a>
							</li>
							<li>
								<a href={resolve('/(social)/lens/post/[postId]', {
									postId: encodeURIComponent(
										'0x0000000000000000000000000000000000000000000000000000000000000001',
									),
								})}>
									Lens v3 publication example
								</a>
							</li>
						</ul>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

