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
			label: 'transaction hash',
		},
		{
			label: 'output index',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'wallet id',
				},
				{
					label: 'transaction hash',
				},
				{
					label: 'output index',
				},
				{
					label: 'account/subaddress indexes',
				},
				{
					label: 'amount',
				},
				{
					label: 'key-image presence',
				},
				{
					label: 'global output index',
				},
				{
					label: 'latest spent/unlocked state',
				},
				{
					label: 'latest confirmations',
				},
				{
					label: 'latest export height',
				},
				{
					label: 'latest checked time',
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
						label: 'BlockheadMoneroOutputState_TimestampView',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'BlockheadMoneroOutputState_TimestampsView',
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
				label: 'Key image',
				items: [
					{
						label: 'redacted key image/signature',
					},
					{
						label: 'import/export status',
					},
				],
			},
			{
				label: 'Wallet',
				items: [
					{
						label: 'BlockheadMoneroWalletStateView',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroOutputState>
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
	entityType={EntityType.BlockheadMoneroOutputState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
