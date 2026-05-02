<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


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


	const calldataByteLength = $derived(
		(() => {
			const hex = entityId.hex
			return (
				hex.length >= 2
				&& hex.startsWith('0x')
				&& (hex.length - 2) % 2 === 0 ?
					(hex.length - 2) / 2
				:	undefined
			)
		})(),
	)


	// Components
	import Boundary from '$/components/Boundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCalldata}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Content()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Calldata</dt>
				<dd>
					<TruncatedValue
						value={entityId.hex}
						format={TruncatedValueFormat.Abbr}
					/>
				</dd>
			</div>
			{#if calldataByteLength !== undefined}
				<div>
					<dt>Bytes</dt>
					<dd>{String(calldataByteLength)}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.EvmCalldata}
				{entityId}
			>
				<Boundary>
					{#snippet Failed(err, _retry)}
						<p role="alert">
							{String(err)}
						</p>
					{/snippet}

					<section>
						<dl>
							{#if calldataByteLength !== undefined}
								<div>
									<dt>Length (bytes)</dt>
									<dd>{String(calldataByteLength)}</dd>
								</div>
							{/if}
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
					</section>
				</Boundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
