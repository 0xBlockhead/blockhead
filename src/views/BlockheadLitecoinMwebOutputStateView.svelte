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
				label: 'wallet id',
			},
			{
				label: 'network',
			},
			'commitment',
		],
		content: {
			dl: [
				[
					{
						label: 'wallet id',
					},
					{
						label: 'network',
					},
					'commitment',
					{
						label: 'public output',
					},
					{
						label: 'amount',
					},
					{
						label: 'address/account label',
					},
					{
						label: 'latest spent state',
					},
					{
						label: 'latest spend transaction id',
					},
					{
						label: 'latest received/spent heights',
					},
					{
						label: 'latest confirmations',
					},
					{
						label: 'latest scan time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest state',
					items: [
						{
							label: 'BlockheadLitecoinMwebOutputState_TimestampView',
						},
					],
				},
				{
					label: 'State history',
					items: [
						{
							label: 'BlockheadLitecoinMwebOutputState_TimestampsView',
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
					label: 'Ownership/value',
					items: [
						{
							label: 'local address',
						},
						'account',
						'label',
						{
							label: 'amount',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'wallet output identity',
						},
						{
							label: 'label payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLitecoinMwebOutputState>
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
	entityType={EntityType.BlockheadLitecoinMwebOutputState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
