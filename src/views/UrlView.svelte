<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		entityId,
		href = entityId.url,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Url>
			href?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
			| 'Icon'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const urlEntity = useEntity(
		EntityType.Url,
		entityId,
		{
			$: [
				Source.MetadataVision_Rest,
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Lifi_Rest,
			],
			catalogName: {},
			catalogStandard: {},
			catalogIcon: {},
			openGraphTitle: {},
			openGraphDescription: {},
			publisher: {},
			$siteIcon: {},
			$openGraphImage: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.Url}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.url}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={urlEntity}
			placeholderText="Loading URL…"
		>
			{#snippet children(u)}
				{u.openGraphTitle ?? u.catalogName ?? entityId.url}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl>
			<div>
				<dt>Id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

			<ResourceBoundary resource={urlEntity}>
				{#snippet children(u)}
					{#if contentOpen}
						{#if u.openGraphDescription != null}
							<div>
								<dt>Description</dt>
								<dd>{u.openGraphDescription}</dd>
							</div>
						{/if}
					{/if}
					{#if u.publisher != null}
						<div>
							<dt>Publisher</dt>
							<dd>{u.publisher}</dd>
						</div>
					{/if}
					{#if contentOpen}
						{#if u.catalogStandard != null}
							<div>
								<dt>Explorer standard</dt>
								<dd>{u.catalogStandard}</dd>
							</div>
						{/if}
					{/if}
					{#if contentOpen}
						{#if u.$openGraphImage != null}
							{#if u.$openGraphImage[EntityMetaKey.Id].url}
								<div>
									<dt>Preview</dt>
									<dd>
										<Media
											alt={u.openGraphTitle ?? ''}
											media={{ url: u.$openGraphImage[EntityMetaKey.Id].url }}
										/>
									</dd>
								</div>
							{/if}
						{/if}
					{/if}
					{#if u.openGraphTitle != null}
						<div>
							<dt>Website</dt>
							<dd>
								<a
									href={entityId.url}
									rel="noreferrer"
									target="_blank"
								>
									{entityId.url}
								</a>
							</dd>
						</div>
					{:else}
						{#if u.catalogName != null}
							<div>
								<dt>Website</dt>
								<dd>
									<a
										href={entityId.url}
										rel="noreferrer"
										target="_blank"
									>
										{entityId.url}
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
		<EntityDetails
			entityType={EntityType.Url}
			{entityId}
		/>
	{/snippet}
</EntityView>
