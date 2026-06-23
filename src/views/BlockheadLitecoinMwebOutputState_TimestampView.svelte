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
						label: 'spend transaction id',
					},
					{
						label: 'received height',
					},
					{
						label: 'spent height',
					},
					'confirmations',
					{
						label: 'last scanned time',
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
							label: 'BlockheadLitecoinMwebOutputStateView',
						},
					],
				},
				{
					label: 'Public output',
					items: [
						{
							label: 'LitecoinMwebOutputView when resolved',
						},
					],
				},
				{
					label: 'Wallet',
					items: [
						{
							label: 'BlockheadLitecoinMwebWalletStateView',
						},
					],
				},
				{
					label: 'Spend context',
					items: [
						{
							label: 'spend transaction id',
						},
						{
							label: 'spent height',
						},
						{
							label: 'confirmation state',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'wallet scan/listunspent/gettransaction payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLitecoinMwebOutputState_Timestamp>
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
	entityType={EntityType.BlockheadLitecoinMwebOutputState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
