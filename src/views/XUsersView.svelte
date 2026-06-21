<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		id,
		href = '',
		open = $bindable(true),
		title = 'X profiles',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.XUser>
			id: string
			href?: string
			open?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.XUser}
	{id}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
			<p>
				Public X (Twitter) profile records.
			</p>
			<p>
				Not markets, storage, Reddit, chat apps, or chain receipts. Live lookup depends on OAuth or bearer credentials and X developer API availability.
			</p>
		{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [Source.X_Rest, Source.X_FxEmbed_Rest],
				})} placeholderText={`Loading ${title.toLowerCase()}…`}>
				{#snippet children(users)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.XUser}
						id={`${id}-items`}
						href={href}
						{title}
						getKey={(row) => stringify(row.entitySelector)}
						getSortValue={(row) => stringify(row.entitySelector)}
						items={users.entities}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						open={true}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No X profiles in this xUsers yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<XUserView
								selection={select(EntityType.XUser, item.entitySelector)}
								layout={EntityLayout.Summary}
								open={false}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
