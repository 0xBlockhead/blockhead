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
		'memo',
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
				'memo',
				{
					label: 'latest state',
				},
				{
					label: 'value msat',
				},
				{
					label: 'latest amount paid',
				},
				{
					label: 'created time',
				},
				{
					label: 'latest settled time',
				},
				{
					label: 'expiry seconds',
				},
				{
					label: 'private flag',
				},
				{
					label: 'add index',
				},
				{
					label: 'latest settle index',
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
						label: 'latest invoice lifecycle observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped invoice lifecycle observations',
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
				label: 'Payment request',
				items: [
					{
						label: 'full BOLT11 string',
					},
					{
						label: 'decoded invoice context when available',
					},
				],
			},
			{
				label: 'Settlement',
				items: [
					{
						label: 'amount paid',
					},
					{
						label: 'settled time',
					},
					{
						label: 'settle index',
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
						label: 'LND invoice identity/request payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningInvoice>
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
	entityType={EntityType.BlockheadLightningInvoice}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
