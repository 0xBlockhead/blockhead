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
			label: 'wallet request',
		},
		{
			label: 'observation time',
		},
		'source',
		'status',
	],
	content: {
		dl: [
			[
				{
					label: 'wallet request',
				},
				{
					label: 'observation time',
				},
				'source',
				'status',
				{
					label: 'wallet status code',
				},
				{
					label: 'wallet call bundle status',
				},
				{
					label: 'atomic execution',
				},
				{
					label: 'receipt count',
				},
				{
					label: 'transaction hash',
				},
				{
					label: 'transaction id',
				},
				{
					label: 'signature hash',
				},
				{
					label: 'status payload hash',
				},
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Wallet request',
				items: [
					{
						label: 'BlockheadWalletRequestView',
					},
				],
			},
			{
				label: 'Status evidence',
				items: [
					{
						label: 'wallet-reported status/result payload retained only when needed',
					},
				],
			},
			{
				label: 'Chain evidence',
				items: [
					{
						label: 'linked transaction rows when resolved',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletRequest_Timestamp>
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
	entityType={EntityType.BlockheadWalletRequest_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
