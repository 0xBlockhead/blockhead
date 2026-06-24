<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		{
			label: 'head HyperEVM block',
		},
		{
			label: 'environment',
		},
		{
			label: 'stack',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'head HyperEVM block',
				},
				{
					label: 'environment',
				},
				{
					label: 'stack',
				},
				{
					label: 'endpoint availability',
				},
				{
					label: 'latest perp market count',
				},
				{
					label: 'latest spot asset count',
				},
				{
					label: 'latest spot pair count',
				},
				{
					label: 'latest validator count',
				},
				{
					label: 'latest vault count when sourced',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Execution',
				items: [
					{
						label: 'blocks',
					},
					{
						label: 'transactions',
					},
					{
						label: 'network snapshots',
					},
					{
						label: 'validators',
					},
					{
						label: 'endpoints',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'native coin',
					},
					{
						label: 'perp markets',
					},
					{
						label: 'spot assets',
					},
					{
						label: 'spot pairs',
					},
				],
			},
			{
				label: 'Vaults',
				items: [
					{
						label: 'Hyperliquid vault rows',
					},
				],
			},
			{
				label: 'Resources',
				items: [
					{
						label: 'faucets',
					},
					{
						label: 'block explorers',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidNetwork>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.HyperliquidNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
