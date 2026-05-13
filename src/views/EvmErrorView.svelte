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
	import HeadingComponent from '$/components/Heading.svelte'
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
			entityId: EntityId<typeof schema, EntityType.EvmError>
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

	const evmError = useEntity(
		EntityType.EvmError,
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
	entityType={EntityType.EvmError}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={evmError}
			placeholderText="Loading error…"
		>
			{#snippet children(e)}
				<HeadingComponent>{e.signatures[0] ?? entityId.hex}</HeadingComponent>
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
		</dl>
	{/snippet}

	{#snippet Details({ open: _open })}
		<EntityDetails
			entityType={EntityType.EvmError}
			{entityId}
		>
			<section>
				<dl>
					<div>
						<dt>
							Signatures
						</dt>
						<dd>
							<ResourceBoundary
								resource={evmError}
								placeholderText="Loading signatures…"
							>
								{#snippet children(e)}
									{#if e.signatures.length > 0}
										<ul>
										{#each e.signatures as sig (sig)}
												<li><code>{sig}</code></li>
											{/each}
										</ul>
									{:else}
										<p data-text="muted">No signatures found for this error selector.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				</dl>
			</section>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
