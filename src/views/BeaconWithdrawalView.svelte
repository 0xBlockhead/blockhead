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
			label: 'withdrawal index in the slot',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'withdrawal index in the slot',
				},
			],
			[
				{
					label: 'validator index',
				},
				{
					label: 'BeaconValidator ref',
				},
				{
					label: 'recipient EvmAccount ref',
				},
				{
					label: 'amount in gwei',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Slot',
				items: [
					{
						label: 'beacon block/body withdrawal context',
					},
				],
			},
			{
				label: 'Validator',
				items: [
					{
						label: 'validator index',
					},
					{
						label: 'BeaconValidator',
					},
				],
			},
			{
				label: 'Recipient',
				items: [
					{
						label: 'EvmAccount',
					},
					{
						label: 'amount in gwei',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'beacon block withdrawals payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconWithdrawal>
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
	entityType={EntityType.BeaconWithdrawal}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
