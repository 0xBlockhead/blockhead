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
		'balance',
		'limit',
		{
			label: 'liabilities',
		},
	],
	content: {
		dl: [
			[
				'balance',
				'limit',
				{
					label: 'liabilities',
				},
				{
					label: 'authorization/clawback flags',
				},
				{
					label: 'ledger sequence',
				},
				'source',
				{
					label: 'observation time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Trustline',
				items: [
					{
						label: 'StellarTrustline',
					},
				],
			},
			{
				label: 'Balances/limits',
				items: [
					'balance',
					'limit',
					{
						label: 'buying/selling liabilities',
					},
				],
			},
			{
				label: 'Authorization',
				items: [
					'authorized',
					{
						label: 'authorized to maintain liabilities',
					},
					{
						label: 'clawback enabled',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Horizon/RPC/explorer trustline payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarTrustline_Timestamp>
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
	entityType={EntityType.StellarTrustline_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
