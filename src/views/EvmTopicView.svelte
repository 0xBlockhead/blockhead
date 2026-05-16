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
			entityId: EntityId<typeof schema, EntityType.EvmTopic>
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

	const topic = useEntity(
		EntityType.EvmTopic,
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
	entityType={EntityType.EvmTopic}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.hex}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={topic}
			placeholderText="Loading topic…"
		>
			{#snippet children(t)}
				{t.signatures[0] ?? entityId.hex}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
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
				<ResourceBoundary
					resource={topic}
					placeholderText="Loading signatures…"
				>
					{#snippet children(t)}
						{#if t.signatures.length}
							<div>
								<dt>
									Signatures
								</dt>
								<dd>
									<ul>
										{#each t.signatures as sig (sig)}
											<li><code>{sig}</code></li>
										{/each}
									</ul>
								</dd>
							</div>
						{/if}
						{#if !t.signatures.length}
							<div>
								<dt>
									Signatures
								</dt>
								<dd>
									<p data-text="muted">No signatures found for this topic.</p>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: _open })}
		<EntityDetails
			entityType={EntityType.EvmTopic}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
