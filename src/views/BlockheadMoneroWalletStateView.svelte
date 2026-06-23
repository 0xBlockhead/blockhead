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
			{
				label: 'primary address',
			},
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
					{
						label: 'primary address',
					},
					{
						label: 'view-only flag',
					},
					{
						label: 'trusted-daemon flag',
					},
					{
						label: 'latest height',
					},
					{
						label: 'latest balance',
					},
					{
						label: 'latest unlocked balance',
					},
					{
						label: 'latest multisig import status',
					},
					{
						label: 'latest sync time',
					},
					{
						label: 'view-key fingerprint',
					},
					{
						label: 'spend-key availability',
					},
					{
						label: 'timestamp count',
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
							label: 'BlockheadMoneroWalletState_TimestampView',
						},
					],
				},
				{
					label: 'State history',
					items: [
						{
							label: 'BlockheadMoneroWalletState_TimestampsView',
						},
					],
				},
				{
					label: 'Subaddresses',
					items: [
						{
							label: 'BlockheadMoneroSubaddressState list',
						},
					],
				},
				{
					label: 'Outputs',
					items: [
						{
							label: 'BlockheadMoneroOutputState list',
						},
					],
				},
				{
					label: 'Transfers',
					items: [
						{
							label: 'BlockheadMoneroTransferState list',
						},
					],
				},
				{
					label: 'Sync/export',
					items: [
						{
							label: 'output export',
						},
						{
							label: 'key-image export times',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'MoneroNetworkView',
						},
					],
				},
				{
					label: 'Key material',
					items: [
						{
							label: 'redacted view/spend/multisig fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroWalletState>
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
	entityType={EntityType.BlockheadMoneroWalletState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
