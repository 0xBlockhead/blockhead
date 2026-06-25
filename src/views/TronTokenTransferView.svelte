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
		'$network',
		'transactionId',
		'transferIndex',
	],
	content: {
		dl: [
			[
				'$network',
				'transactionId',
				'transferIndex',
				'$token',
				'standard',
			],
			[
				'$from',
				'$to',
				'amount',
				'timestampMs',
				'$transaction',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'containing transaction',
					},
				],
			},
			{
				label: 'Token',
				items: [
					{
						label: 'token identity',
					},
				],
			},
			{
				label: 'From',
				items: [
					{
						label: 'sender account',
					},
				],
			},
			{
				label: 'To',
				items: [
					{
						label: 'recipient account',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronTokenTransfer>
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
	entityType={EntityType.TronTokenTransfer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
