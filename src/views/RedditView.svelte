<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/reddit'),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RedditNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.RedditNetwork}
	entitySelector={selection.entitySelector}
	href={href}
	layout={EntityLayout.SummaryDetails}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="Reddit"
>
	{#snippet Value()}
		Reddit
	{/snippet}

	{#snippet Title()}
		Reddit
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Reddit’s HTTP APIs return communities, ranked submissions, and linked comment threads under a common JSON model.
		</p>
		<p>
			Reddit’s public API surfaces subreddits, submissions, and comment trees over HTTPS—separate transport from low-latency game/voice rooms or Nostr/Farcaster relays.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection({
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						protocolName: true,
						registryLabel: true,
						...(open && {
							docsUrl: true,
							homeUrl: true,
							topology: true,
						}),
					},
				})}
				placeholderText="Loading Reddit…"
			>
				{#snippet children(redditNetwork)}
					{#if redditNetwork.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{redditNetwork.registryLabel}</dd>
						</div>
					{:else if redditNetwork.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{redditNetwork.protocolName}</dd>
						</div>
					{/if}

					{#if open && redditNetwork.homeUrl}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={redditNetwork.homeUrl}>
										{redditNetwork.homeUrl}
									</a>
							</dd>
						</div>
					{/if}

						{#if open && redditNetwork.docsUrl}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={redditNetwork.docsUrl}>
										{redditNetwork.docsUrl}
									</a>
								</dd>
							</div>
						{/if}

						{#if open && redditNetwork.topology}
							<div>
								<dt>Topology</dt>
								<dd>{redditNetwork.topology}</dd>
							</div>
						{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
