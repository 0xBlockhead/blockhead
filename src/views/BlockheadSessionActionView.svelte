<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		actions: [
			{
				id: 'reveal-action-params',
				label: 'Reveal action parameters',
				kind: 'reveal',
				field: 'actionParams',
			},
			{
				id: 'delete-action',
				label: 'Delete action',
				kind: 'deleteLocal',
				slot: 'DeleteSessionAction',
			},
		],
		forms: [
			{
				id: 'edit-params',
				label: 'Edit parameters',
				kind: 'createLocal',
				fields: [
					{
						name: 'actionParams',
						label: 'Action parameters',
						kind: 'textarea',
					},
				],
				slot: 'EditActionParamsForm',
			},
		],
		closed: [
			{
				label: 'session',
			},
			{
				label: 'action id',
			},
			{
				label: 'sequence index',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'session',
					},
					{
						label: 'action id',
					},
					{
						label: 'sequence index',
					},
					{
						label: 'action type',
					},
					{
						label: 'selected protocol',
					},
					{
						label: 'created/updated timestamps',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Typed intent',
					items: [
						{
							label: 'BlockheadSwapIntent',
						},
						{
							label: 'BlockheadBridgeIntent',
						},
						{
							label: 'BlockheadTransferIntent',
						},
						{
							label: 'or future typed local intent row',
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
					label: 'Quotes',
					items: [
						{
							label: 'BlockheadIntentQuote list when signed-order/filler-market backed',
						},
					],
				},
				{
					label: 'Orders',
					items: [
						{
							label: 'BlockheadIntentOrder list when submitted',
						},
					],
				},
				{
					label: 'Wallet requests',
					items: [
						{
							label: 'BlockheadWalletRequest list when signing/submission is requested',
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
				{
					label: 'Raw params',
					items: [
						{
							label: 'actionParams fallback/debug payload',
						},
					],
				},
				{
					label: 'Session',
					items: [
						{
							label: 'parent local session',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSessionAction>
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
	entityType={EntityType.BlockheadSessionAction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
