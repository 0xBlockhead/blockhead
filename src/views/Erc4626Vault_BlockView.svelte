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
			label: 'vault',
		},
		{
			label: 'block number',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'vault',
				},
				{
					label: 'block number',
				},
				'source',
				{
					label: 'total assets',
				},
				{
					label: 'total supply',
				},
				{
					label: 'assets per share',
				},
				{
					label: 'shares per asset',
				},
				{
					label: 'deposit/mint/withdraw/redeem limits',
				},
				{
					label: 'preview outputs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Vault',
				items: [
					{
						label: 'parent ERC-4626 vault',
					},
				],
			},
			{
				label: 'Contract calls',
				items: [
					{
						label: 'method names',
					},
					{
						label: 'arguments',
					},
					{
						label: 'return values',
					},
					{
						label: 'RPC block tag',
					},
				],
			},
			{
				label: 'Asset/share context',
				items: [
					{
						label: 'linked token instances',
					},
					{
						label: 'raw-unit display',
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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4626Vault_Block>
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
	entityType={EntityType.Erc4626Vault_Block}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
