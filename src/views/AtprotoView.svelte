<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import {
		atprotoNetworkSeedActors,
		atprotoNetworkSeedPosts,
	} from '$/constants/Social/Atproto.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/atproto'),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoNetwork>
			href?: string
			layout?: EntityLayout
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()


	const atprotoNetwork = $derived(
		selection(
			{
				sources: [Source.Constants_Internal],
				fields: {
					protocolName: true,
					registryLabel: true,
					...(open && {
						homeUrl: true,
						docsUrl: true,
						topology: true,
						$$atprotoActors: {
							sources: [
								Source.Constants_Internal,
								Source.Atproto_Xrpc,							],
						},
					}),
				},
			}
		)
	)


	// (Derived)
	const networkSelectorKey = $derived(
		stringify(selection.entitySelector),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import AtprotoActorsView from '$/views/AtprotoActorsView.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoNetwork}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="AT Protocol"
>
	{#snippet Value()}
		AT Protocol
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={atprotoNetwork}
			placeholderText="Loading AT Protocol directory…"
		>
			{#snippet children(atprotoNetwork)}
				{atprotoNetwork.fields.protocolName ?? 'AT Protocol'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			The AT Protocol anchors accounts in DIDs served by personal data stores; lexicon schemas define posts, follows, and profile blobs replicated through relays as signed CAR commits.
		</p>
		<p>
			Actor atprotoNetworks in this hub cover only the handles that configured App View sources can resolve—not every Bluesky-compatible identity on the network.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: _contentOpen,
	})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={atprotoNetwork}
				placeholderText="Loading AT Protocol directory…"
			>
				{#snippet children(atprotoNetwork)}
					{#if atprotoNetwork.fields.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{atprotoNetwork.fields.registryLabel}</dd>
						</div>
					{:else if atprotoNetwork.fields.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{atprotoNetwork.fields.protocolName}</dd>
						</div>
					{/if}

					{#if _contentOpen}
						<div>
							<dt>Accounts</dt>
							<dd>{String(atprotoNetwork.fields.$$atprotoActors.values.length )}</dd>
						</div>

						{#if atprotoNetwork.fields.topology}
							<div>
								<dt>Topology</dt>
								<dd>{atprotoNetwork.fields.topology}</dd>
							</div>
						{/if}

						{#if atprotoNetwork.fields.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={atprotoNetwork.fields.homeUrl}>{atprotoNetwork.fields.homeUrl}</a>
								</dd>
							</div>
						{/if}

						{#if atprotoNetwork.fields.docsUrl != null && atprotoNetwork.fields.docsUrl !== ''}
							<div>
								<dt>Documentation</dt>
								<dd>
									<a href={atprotoNetwork.fields.docsUrl}>
										{atprotoNetwork.fields.docsUrl}
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
			id={`${networkSelectorKey}:carousel-registry`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'registry-actors', label: 'Accounts' },
				{ id: 'registry-posts', label: 'Recent posts' },
				{ id: 'examples-atprotoNetworks', label: 'Example routes' },
			]}
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

			{#snippet SectionRegistryActors({ id: _id, label: _label })}
				<AtprotoActorsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/atproto/actors')}
					selection={selection.$$atprotoActors}
					id={`${networkSelectorKey}:actors`}
					open={_open}
				/>
			{/snippet}

			{#snippet SectionRegistryPosts({ id: _id, label: _label })}
				<AtprotoPostsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/atproto/posts')}
					selection={selection.$$atprotoPosts}
					fieldOpen={_open}
					id={`${networkSelectorKey}:posts`}
					open={_open}
					title="Recent posts"
				/>
			{/snippet}

			{#snippet SectionExamplesList({ id: _id, label: _label })}
				<ul>
					<li>
						<a href={resolve('/(social)/(atproto)/atproto/actor/[did]', {
							did: encodeURIComponent(atprotoNetworkSeedActors[0].did),
						})}>
							Actor example
						</a>
					</li>
					<li>
						<a href={resolve('/(social)/(atproto)/atproto/post/[...uri]', {
							uri: encodeURIComponent(atprotoNetworkSeedPosts[0].uri),
						})}>
							Post example
						</a>
					</li>
				</ul>
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
