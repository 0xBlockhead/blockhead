<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(social)/(atproto)/atproto/post/[...uri]', {
			uri: encodeURIComponent(selection.entitySelector.uri),
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoPost>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	const idKey = $derived(stringify(selection.entitySelector))

	const post = $derived(selection(
			{
					sources: [
						Source.Constants_Internal,
					],
				fields: {
					$author: true,
				},
			},
		))


	// Components
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoPost}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			endLength={12}
			format={TruncatedValueFormat.Visual}
			startLength={20}
			value={selection.entitySelector.uri}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={post}
				placeholderText="Loading post…"
			>
				{#snippet children(post)}
					<span data-text="font-monospace">
						<TruncatedValue
							value={selection.entitySelector.uri}
							format={TruncatedValueFormat.Visual}
						/>
					</span>
					{/snippet}
			</ResourceBoundary>
		{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Bluesky posts are AT Protocol repository records keyed by at-URI; text, reply parent/root, and engagement counts come from the public App View API.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={post}
				placeholderText="Loading post…"
			>
				{#snippet children(post)}
					<dl data-column-item="center">
						{#if contentOpen && post.fields.$author}
							<div>
								<dt>Author</dt>
							<dd>
								<AtprotoActorView
									selection={select(EntityType.AtprotoActor, post.fields.$author[EntityMetaKey.Selector])}
									layout={EntityLayout.Title}

									open={false}
									/>
								</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		{/snippet}
		</EntityView>
