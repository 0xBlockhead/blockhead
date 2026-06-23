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
				label: 'account',
			},
			{
				label: 'subaccount number',
			},
			{
				label: 'latest equity',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'account',
					},
					{
						label: 'subaccount number',
					},
					{
						label: 'latest equity/free collateral',
					},
					{
						label: 'latest margin status',
					},
					{
						label: 'position count',
					},
					{
						label: 'open order count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Subaccount observations',
					items: [
						{
							label: 'timestamped subaccount risk/collateral observations',
						},
					],
				},
				{
					label: 'Positions',
					items: [
						{
							label: 'perpetual position observations',
						},
					],
				},
				{
					label: 'Orders',
					items: [
						{
							label: 'dYdX order rows',
						},
					],
				},
				{
					label: 'Account',
					items: [
						{
							label: 'underlying Cosmos account',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent dYdX Chain network',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'dYdX indexer subaccount payload',
						},
						{
							label: 'validator app-state query',
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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainSubaccount>
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
	entityType={EntityType.DydxChainSubaccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
