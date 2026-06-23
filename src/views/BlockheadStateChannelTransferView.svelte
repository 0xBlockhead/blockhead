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
				label: 'channel',
			},
			{
				label: 'turn number',
			},
			{
				label: 'from account',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'channel',
					},
					{
						label: 'turn number',
					},
					{
						label: 'from account',
					},
					{
						label: 'to account',
					},
					'amount',
					'timestamp',
					'status',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Channel',
					items: [
						{
							label: 'parent local state channel',
						},
					],
				},
				{
					label: 'Participants',
					items: [
						{
							label: 'from/to EVM accounts',
						},
					],
				},
				{
					label: 'Turn',
					items: [
						{
							label: 'linked signed channel state when modeled',
						},
					],
				},
				{
					label: 'Settlement evidence',
					items: [
						{
							label: 'public ledger rows only when a submitted state or withdrawal proves them',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadStateChannelTransfer>
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
	entityType={EntityType.BlockheadStateChannelTransfer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
