<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Props
	let {
		children,
		entityId,
		title = 'Calldata',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmCalldata>
			title?: string
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const calldata = useEntity(
		EntityType.EvmCalldata,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
			],
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCalldata}
	{entityId}
	{title}
	{href}
	idDragPlainText={stringify(entityId)}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.hex}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading calldata…"
			resource={calldata}
		>
			{#snippet children(_)}
				<dl>
					<div>
						<dt>Calldata</dt>
						<dd>
							<TruncatedValue
								value={entityId.hex}
								format={TruncatedValueFormat.Abbr}
							/>
						</dd>
					</div>
					<div>
						<dt>Bytes</dt>
						<dd>{String((entityId.hex.length - 2) / 2)}</dd>
					</div>
					{#if open}
						<div>
							<dt>Hex</dt>
							<dd>
								<TruncatedValue
									value={entityId.hex}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.EvmCalldata}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
