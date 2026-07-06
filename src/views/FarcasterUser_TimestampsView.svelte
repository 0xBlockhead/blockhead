<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Farcaster user observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterUser_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.FarcasterUser_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterUser_TimestampView from '$/views/FarcasterUser_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					$user: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FarcasterUser_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(farcasterUserTimestamps)}
			{@const uniqueFarcasterUserTimestamps = [...new Map(farcasterUserTimestamps.values.map((farcasterUserTimestamp) => [farcasterUserTimestamp[EntityMetaKey.SelectorKey], farcasterUserTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FarcasterUser_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={farcasterUserTimestamps.totalCount}
				getKey={(farcasterUserTimestamp) => farcasterUserTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueFarcasterUserTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Farcaster user observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: farcasterUserTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.FarcasterUser_Timestamp> })}
					{@const farcasterUserTimestampFields = { ...farcasterUserTimestamp[EntityMetaKey.Selector], ...farcasterUserTimestamp }}
					{@const farcasterUserTimestampHrefFields = { ...farcasterUserTimestamp, ...farcasterUserTimestamp[EntityMetaKey.Selector] }}
					<FarcasterUser_TimestampView
						selection={select(EntityType.FarcasterUser_Timestamp, farcasterUserTimestamp[EntityMetaKey.Selector])}
						prefetched={farcasterUserTimestampFields}
						href={
							(farcasterUserTimestampHrefFields.$user !== undefined && farcasterUserTimestampHrefFields.$user.fid !== undefined && farcasterUserTimestampHrefFields.timestampMs !== undefined ? resolve('/(social)/(farcaster)/farcaster/user/[userId=farcasterFid]/(user)/observations/[timestampMs=nonNegativeInteger]', {
								userId: String(farcasterUserTimestampHrefFields.$user.fid ?? ''),
								timestampMs: String(farcasterUserTimestampHrefFields.timestampMs ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.FarcasterUser_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
