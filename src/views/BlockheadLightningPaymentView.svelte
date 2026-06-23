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
				label: 'network',
			},
			{
				label: 'payment hash',
			},
			{
				label: 'latest status',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'payment hash',
					},
					{
						label: 'latest status',
					},
					{
						label: 'value msat',
					},
					{
						label: 'latest fee msat',
					},
					{
						label: 'created time',
					},
					{
						label: 'latest failure reason',
					},
					{
						label: 'latest preimage status',
					},
					{
						label: 'payment index',
					},
					{
						label: 'linked invoice',
					},
					{
						label: 'payment request',
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
							label: 'latest payment lifecycle observation',
						},
					],
				},
				{
					label: 'State history',
					items: [
						{
							label: 'timestamped payment lifecycle observations',
						},
					],
				},
				{
					label: 'Local node',
					items: [
						{
							label: 'connected Lightning node state',
						},
					],
				},
				{
					label: 'Invoice',
					items: [
						{
							label: 'linked local invoice when resolved',
						},
					],
				},
				{
					label: 'Payment request',
					items: [
						{
							label: 'full BOLT11 string when present',
						},
					],
				},
				{
					label: 'Result',
					items: [
						{
							label: 'status',
						},
						{
							label: 'failure reason',
						},
						{
							label: 'preimage',
						},
						{
							label: 'fee',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Lightning network',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'LND payment identity/request payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningPayment>
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
	entityType={EntityType.BlockheadLightningPayment}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
