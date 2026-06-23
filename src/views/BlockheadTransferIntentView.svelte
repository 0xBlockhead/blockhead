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
				label: 'session action',
			},
			{
				label: 'from/to accounts',
			},
			{
				label: 'network',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'session action',
					},
					{
						label: 'from/to CAIP-10',
					},
					{
						label: 'network CAIP-2',
					},
					{
						label: 'asset CAIP-19',
					},
					{
						label: 'EVM from/to/token shortcuts',
					},
					{
						label: 'resolved account/network/token refs',
					},
					'amount',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Session action',
					items: [
						{
							label: 'BlockheadSessionActionView',
						},
					],
				},
				{
					label: 'Readiness',
					items: [
						{
							label: 'BlockheadActionReadinessCheck list',
						},
					],
				},
				{
					label: 'Execution',
					items: [
						{
							label: 'authorization',
						},
						{
							label: 'wallet requests',
						},
						{
							label: 'receipt rows when source-proven',
						},
					],
				},
				{
					label: 'Outcomes',
					items: [
						{
							label: 'BlockheadActionOutcome list',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadTransferIntent>
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
	entityType={EntityType.BlockheadTransferIntent}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
