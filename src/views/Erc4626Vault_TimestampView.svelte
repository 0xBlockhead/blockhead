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
			label: 'observation time',
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
					label: 'observation time',
				},
				'source',
				{
					label: 'base/reward/total APY',
				},
				{
					label: 'TVL USD',
				},
				{
					label: 'project slug',
				},
				{
					label: 'chain label',
				},
				{
					label: 'pool id',
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
				label: 'Rewards',
				items: [
					{
						label: 'reward token addresses mapped to EVM coin instances when resolvable',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'DefiLlama pool/chart payload',
					},
					{
						label: 'chain/project keys',
					},
					{
						label: 'contract mapping confidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4626Vault_Timestamp>
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
	entityType={EntityType.Erc4626Vault_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
