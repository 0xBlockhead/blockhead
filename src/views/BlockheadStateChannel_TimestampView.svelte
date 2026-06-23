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
				label: 'observation time',
			},
			'status',
		],
		content: {
			dl: [
				[
					{
						label: 'channel',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'total deposited',
					},
					{
						label: 'participant balances',
					},
					{
						label: 'turn number',
					},
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
					label: 'Current signed state',
					items: [
						{
							label: 'signed channel state near the same turn/version',
						},
					],
				},
				{
					label: 'Deposits',
					items: [
						{
							label: 'deposit observations around the same timestamp',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'local client/store/node channel snapshot',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadStateChannel_Timestamp>
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
	entityType={EntityType.BlockheadStateChannel_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
