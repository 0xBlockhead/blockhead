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
			label: 'deposit',
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
					label: 'deposit',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'available balance',
				},
				{
					label: 'locked balance',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Deposit',
				items: [
					{
						label: 'parent channel/account deposit slice',
					},
				],
			},
			{
				label: 'Channel',
				items: [
					{
						label: 'parent local state channel',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'local client/store/node collateral snapshot',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadStateChannelDeposit_Timestamp>
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
	entityType={EntityType.BlockheadStateChannelDeposit_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
