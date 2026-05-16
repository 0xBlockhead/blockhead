<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { stringify } from 'devalue'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const entityId = (
		{
			scope: 'LensNetwork' as const,
		} satisfies EntityId<typeof schema, EntityType.LensNetwork>
	)

	const networkIdKey = stringify(entityId)

	let open = $bindable(true)

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
	import Collapsible from '$/components/Collapsible.svelte'
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
	title="Lens"
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.scope}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={lensNetwork}>
			{#snippet children(loaded)}
				<dl>
					<div>
						<dt>Scope</dt>
						<dd>{entityId.scope}</dd>
					</div>
					<div>
						<dt>Accounts</dt>
						<dd>{String(loaded.$$lensAccounts.length)}</dd>
					</div>
					<div>
						<dt>Posts</dt>
						<dd>{String(loaded.$$lensPosts.length)}</dd>
					</div>
					{#if open}
						<div>
							<dt>Protocol name</dt>
							<dd>{loaded.protocolName}</dd>
						</div>
						<div>
							<dt>Home</dt>
							<dd>
								<a href={loaded.homeUrl}>{loaded.homeUrl}</a>
							</dd>
						</div>
						{#if loaded.docsUrl !== undefined}
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
							Registry
						</HeadingComponent>
					</header>
				{/snippet}

				<div
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
					style="--carousel-basis: 36ch"
				>
					<section data-scroll-marker-label="Accounts">
						<LensAccountsView
							entityFieldReference={{
								entityType: EntityType.LensNetwork,
								entityId,
								fieldName: '$$lensAccounts',
							}}
							href={resolve('/(social)/lens')}
							id={`${networkIdKey}:accounts`}
							open={false}
						/>
					</section>

					<section data-scroll-marker-label="Recent posts">
						<LensPostsView
							entityFieldReference={{
								entityType: EntityType.LensNetwork,
								entityId,
								fieldName: '$$lensPosts',
							}}
							href={resolve('/(social)/lens')}
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

				<ul>
					<li>
						<a href={resolve('/(social)/lens/account/[address]', {
							address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
						})}>
							Account example
						</a>
					</li>
					<li>
						<a href={resolve('/(social)/lens/post/[postId]', {
							postId: encodeURIComponent(
								'0x0000000000000000000000000000000000000000000000000000000000000001',
							),
						})}>
							Post example
						</a>
					</li>
				</ul>
			</Collapsible>
		</div>
	{/snippet}
</EntityView>
