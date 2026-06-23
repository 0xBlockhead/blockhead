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
				label: 'schedule',
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
						label: 'schedule',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'executed timestamp',
					},
					{
						label: 'deleted flag',
					},
					{
						label: 'expiration',
					},
					{
						label: 'wait-for-expiry',
					},
					{
						label: 'signature count',
					},
					{
						label: 'execution transaction',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Schedule',
					items: [
						{
							label: 'parent Hedera schedule',
						},
					],
				},
				{
					label: 'Signatures',
					items: [
						{
							label: 'schedule signatures near the same observation',
						},
					],
				},
				{
					label: 'Execution transaction',
					items: [
						{
							label: 'executed Hedera transaction',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'raw schedule payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaSchedule_Timestamp>
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
	entityType={EntityType.HederaSchedule_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
