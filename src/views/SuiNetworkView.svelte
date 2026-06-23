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
				label: 'latest checkpoint/epoch/protocol version snapshot',
			},
			{
				label: 'execution environment',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'linked Network',
					},
					{
						label: 'latest checkpoint/epoch/protocol version snapshot',
					},
					{
						label: 'execution environment',
					},
					{
						label: 'account count',
					},
					{
						label: 'object count',
					},
					{
						label: 'package count',
					},
					{
						label: 'coin type count',
					},
					{
						label: 'transaction count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Checkpoints',
					items: [
						{
							label: 'Sui checkpoint rows',
						},
					],
				},
				{
					label: 'Transactions',
					items: [
						{
							label: 'Sui transaction rows',
						},
					],
				},
				{
					label: 'Accounts',
					items: [
						{
							label: 'Sui account rows',
						},
					],
				},
				{
					label: 'Objects',
					items: [
						{
							label: 'Sui object rows',
						},
					],
				},
				{
					label: 'Packages',
					items: [
						{
							label: 'Sui package rows',
						},
					],
				},
				{
					label: 'Coin types',
					items: [
						{
							label: 'Sui coin type rows',
						},
					],
				},
				{
					label: 'Balances',
					items: [
						{
							label: 'coin balance observations',
						},
					],
				},
				{
					label: 'Network snapshots',
					items: [
						{
							label: 'timestamped network observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiNetwork>
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
	entityType={EntityType.SuiNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
