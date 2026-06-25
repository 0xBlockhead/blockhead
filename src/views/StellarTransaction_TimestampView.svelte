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
		'$transaction',
		{
			label: 'ledger',
		},
		{
			label: 'success/result code',
		},
	],
	content: {
		dl: [
			[
				'$transaction',
				'timestampMs',
				'source',
				{
					label: 'ledger',
				},
				{
					label: 'success/result code',
				},
				{
					label: 'fee charged/max fee',
				},
			],
			[
				'memo',
				'signatures',
				{
					label: 'envelope/result/meta XDR availability',
				},
				{
					label: 'fee meta XDR availability',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent Stellar transaction',
					},
				],
			},
			{
				label: 'Operations',
				items: [
					{
						label: 'operations for same transaction',
					},
				],
			},
			{
				label: 'XDR',
				items: [
					{
						label: 'envelope',
					},
					{
						label: 'result',
					},
					{
						label: 'meta',
					},
					{
						label: 'fee meta',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Horizon transaction object',
					},
					{
						label: 'RPC getTransaction payload',
					},
					{
						label: 'explorer retention/freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarTransaction_Timestamp>
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
	entityType={EntityType.StellarTransaction_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
