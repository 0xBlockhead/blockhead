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
			label: 'transaction',
		},
		{
			label: 'account',
		},
		{
			label: 'transfer index',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'transaction',
				},
				{
					label: 'account',
				},
				{
					label: 'transfer index',
				},
				{
					label: 'amount',
				},
				{
					label: 'approval flag',
				},
				{
					label: 'direction',
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
						label: 'parent Hedera transaction',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'linked Hedera account',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'transfer list',
					},
					{
						label: 'payer context',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaHbarTransfer>
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
	entityType={EntityType.HederaHbarTransfer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
