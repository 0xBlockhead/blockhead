<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EnsName>
			href: string
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
		>
	> = $props()


	const ensText = useEntity(
		EntityType.EnsName,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
				Source.TheGraph_Graphql,
			],
			textRecords: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={entityId.name}
>
	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={ensText}>
			{#snippet children(snapshot)}
				<dl>
					<div>
						<dt>Text records</dt>
						<dd>{String(Object.keys(snapshot.textRecords ?? {}).length)}</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.EnsName}
				{entityId}
			>
				<ResourceBoundary resource={ensText}>
					{#snippet children(snapshot)}
						{@const entries = (
							snapshot.textRecords === undefined ?
								[]
							:
								Object.entries(snapshot.textRecords).toSorted(([a], [b]) => (
									a.localeCompare(b)
								))
						)}
						{#if snapshot.textRecords === undefined}
							<p data-text="muted">
								No records available yet.
							</p>
						{:else if entries.length === 0}
							<p data-text="muted">
								No text records found.
							</p>
						{:else}
							<dl>
								{#each entries as [key, value] (key)}
									<div>
										<dt>
											<TruncatedValue
												value={key}
												format={TruncatedValueFormat.Visual}
											/>
										</dt>
										<dd>
											<TruncatedValue
												{value}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/each}
							</dl>
						{/if}
					{/snippet}
				</ResourceBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
