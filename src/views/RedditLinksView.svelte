<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'

	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 25,
		open = $bindable(true),
		collapsible = true,
		title = 'Submissions'
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.RedditLink>
		href: string
		id: string
		limit?: number
		open?: boolean
		title?: string
	} = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<div data-column="gap-2">
	<div data-row="wrap align-center gap-2">
		<Tooltip contentProps={{ side: 'top' }}>
			{#snippet Content()}
				<p>
					Submissions and comment threads sourced from Reddit’s own HTTP APIs.
				</p>
				<p>
					Not Farcaster casts, team rooms, or file pinning networks.
				</p>
			{/snippet}
			<abbr
				class="entity-heading-tip"
				aria-label="About submissions"
			>ⓘ</abbr>
		</Tooltip>
	</div>

	<EntitiesList
		entityType={EntityType.RedditLink}
		{href}
		{id}
		{title}
		bind:open
		{collapsible}
	>
		{#snippet Empty()}
			<div data-row="wrap align-center gap-2">
				<p data-text="muted">
					No Reddit submissions here yet.
				</p>
				<Tooltip contentProps={{ side: 'top' }}>
					{#snippet Content()}
						<p>
							Rows are threads on Reddit itself.
						</p>
						<p>
							They are not social casts or decentralized storage objects.
						</p>
					{/snippet}
					<abbr
						class="entity-heading-tip"
						aria-label="About Reddit submissions"
					>ⓘ</abbr>
				</Tooltip>
			</div>
		{/snippet}

		{#snippet body()}
			{#if open}
				{@const fieldName = entityFieldReference.fieldName}
				{@const parent = useEntity(
					entityFieldReference.entityType,
					entityFieldReference.entityId,
					{
						$: [
							Source.Constants_Internal,
							Source.Reddit_Rest,
						],
						[fieldName]: {
							$: [
								Source.Reddit_Rest,
							],
							limit,
						},
					},
				)}
				{@const links = derive(
					parent,
					(parent) => {
						const rows: Entity<typeof schema, EntityType.RedditLink>[] = (
							parent[fieldName] ?? []
						)
						return (
							rows.map((link) => ({
								...link[EntityMetaKey.Id],
								sortKey: link[EntityMetaKey.IdKey],
							}))
						)
					},
				)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.RedditLink}
					{href}
					id={`${id}-items`}
					{title}
					open={true}
					resource={links}
					placeholderText="Loading submissions…"
					getKey={(row) => row.fullname}
					getSortValue={(row) => row.sortKey}
					placeholderKeys={new SvelteSet<string>()}
				>
					{#snippet Empty()}
						<div data-row="wrap align-center gap-2">
							<p data-text="muted">
								No Reddit submissions here yet.
							</p>
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
									<p>
										Rows are threads on Reddit itself.
									</p>
									<p>
										They are not social casts or decentralized storage objects.
									</p>
								{/snippet}
								<abbr
									class="entity-heading-tip"
									aria-label="About Reddit submissions"
								>ⓘ</abbr>
							</Tooltip>
						</div>
					{/snippet}

					{#snippet Item({
						item: row,
					})}
						{#if row}
							<RedditLinkView
								entityId={{ fullname: row.fullname }}
								href={resolve('/(social)/reddit/link/[fullname]', {
									fullname: encodeURIComponent(row.fullname),
								})}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/if}
					{/snippet}
				</EntitiesList>
			{/if}
		{/snippet}
	</EntitiesList>
</div>
