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
			'address',
			{
				label: 'network',
			},
			{
				label: 'latest SUI balance',
			},
		],
		content: {
			dl: [
				[
					'address',
					{
						label: 'network',
					},
					{
						label: 'latest SUI balance',
					},
					{
						label: 'owned object count',
					},
					{
						label: 'transaction count',
					},
					{
						label: 'balance snapshot count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Balances',
					items: [
						{
							label: 'coin balance observations grouped by coin type',
						},
					],
				},
				{
					label: 'Owned objects',
					items: [
						{
							label: 'Sui objects owned by this account',
						},
					],
				},
				{
					label: 'Transactions',
					items: [
						{
							label: 'Sui transactions involving this account',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Sui network',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiAccount>
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
	entityType={EntityType.SuiAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
