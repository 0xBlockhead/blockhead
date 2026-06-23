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
				label: 'wallet state',
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
						label: 'wallet state',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'MWEB address',
					},
					{
						label: 'transparent address',
					},
					{
						label: 'total balance',
					},
					{
						label: 'MWEB balance',
					},
					{
						label: 'transparent balance',
					},
					{
						label: 'unconfirmed balance',
					},
					{
						label: 'immature balance',
					},
					{
						label: 'last scanned height',
					},
					{
						label: 'last synced time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Wallet',
					items: [
						{
							label: 'BlockheadLitecoinMwebWalletStateView',
						},
					],
				},
				{
					label: 'Outputs',
					items: [
						{
							label: 'BlockheadLitecoinMwebOutputState list',
						},
					],
				},
				{
					label: 'Addresses',
					items: [
						{
							label: 'local transparent/MWEB address material',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'wallet balance/address/scan payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLitecoinMwebWalletState_Timestamp>
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
	entityType={EntityType.BlockheadLitecoinMwebWalletState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
