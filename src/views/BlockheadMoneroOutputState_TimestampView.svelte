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
				label: 'output state',
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
						label: 'output state',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'spent state',
					},
					{
						label: 'unlocked state',
					},
					'confirmations',
					{
						label: 'export height',
					},
					{
						label: 'last checked time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Output state',
					items: [
						{
							label: 'BlockheadMoneroOutputStateView',
						},
					],
				},
				{
					label: 'Public output',
					items: [
						{
							label: 'MoneroStealthOutputView when resolved',
						},
					],
				},
				{
					label: 'Subaddress',
					items: [
						{
							label: 'BlockheadMoneroSubaddressStateView',
						},
					],
				},
				{
					label: 'Transfer',
					items: [
						{
							label: 'BlockheadMoneroTransferState rows for the tx',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'monero-wallet-rpc transfer/output/key-image payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroOutputState_Timestamp>
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
	entityType={EntityType.BlockheadMoneroOutputState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
