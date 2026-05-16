<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'


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
			entityId: EntityId<typeof schema, EntityType.EvmSelector>
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
			| 'Heading'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const selector = useEntity(
		EntityType.EvmSelector,
		entityId,
		{
			$: [
				Source.Openchain_Rest,
			],
			signatures: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.EvmSelector}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.selector}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={selector}
			placeholderText="Loading selector…"
		>
			{#snippet children(s)}
				{s.signatures[0] ?? entityId.hex}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

			<div>
				<dt>Hex</dt>
				<dd>
					<TruncatedValue
						value={entityId.hex}
						format={TruncatedValueFormat.Visual}
					/>
				</dd>
			</div>
			{#if open}
				<div>
					<dt>
						Signatures
					</dt>
					<dd>
						<ResourceBoundary
							resource={selector}
							placeholderText="Loading signatures…"
						>
							{#snippet children(s)}
								{#if s.signatures.length}
									<ul>
									{#each s.signatures as sig (sig)}
											<li><code>{sig}</code></li>
										{/each}
									</ul>
								{:else}
									<p data-text="muted">No signatures found for this selector.</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: _open })}
		<EntityDetails
			entityType={EntityType.EvmSelector}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
