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
			label: 'linked Network',
		},
		{
			label: 'latest era',
		},
		{
			label: 'latest slot/block/epoch snapshot',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'linked Network',
				},
				{
					label: 'latest era',
				},
				{
					label: 'latest slot/block/epoch snapshot',
				},
				{
					label: 'sync progress',
				},
				{
					label: 'native ADA asset',
				},
				{
					label: 'DRep count',
				},
				{
					label: 'governance proposal count',
				},
				{
					label: 'stake pool count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Blocks',
				items: [
					{
						label: 'Cardano blocks',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'Cardano transactions',
					},
				],
			},
			{
				label: 'Addresses',
				items: [
					{
						label: 'Cardano addresses',
					},
				],
			},
			{
				label: 'Stake credentials',
				items: [
					{
						label: 'Cardano stake credentials',
					},
				],
			},
			{
				label: 'Stake pools',
				items: [
					{
						label: 'Cardano stake pools',
					},
				],
			},
			{
				label: 'Governance',
				items: [
					{
						label: 'DReps',
					},
					{
						label: 'governance proposals',
					},
					{
						label: 'committee epoch observations',
					},
					{
						label: 'constitution epoch observations',
					},
				],
			},
			{
				label: 'Native assets',
				items: [
					{
						label: 'Cardano native assets',
					},
				],
			},
			{
				label: 'Protocol parameters',
				items: [
					{
						label: 'epoch-bounded protocol parameter rows',
					},
				],
			},
			{
				label: 'Network snapshots',
				items: [
					{
						label: 'timestamped network tip/sync observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoNetwork>
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
	entityType={EntityType.CardanoNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
