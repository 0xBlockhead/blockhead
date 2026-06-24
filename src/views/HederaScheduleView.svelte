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
			label: 'schedule id',
		},
		{
			label: 'creator',
		},
		{
			label: 'payer',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'schedule id',
				},
				{
					label: 'creator',
				},
				{
					label: 'payer',
				},
				{
					label: 'latest executed timestamp',
				},
				{
					label: 'deleted flag',
				},
				{
					label: 'expiration',
				},
				{
					label: 'wait-for-expiry',
				},
				{
					label: 'signature count',
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
				label: 'Scheduled transaction body',
				items: [
					{
						label: 'transactionBody JSON',
					},
				],
			},
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest schedule lifecycle observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped schedule lifecycle observations',
					},
				],
			},
			{
				label: 'Signatures',
				items: [
					{
						label: 'schedule signature rows',
					},
				],
			},
			{
				label: 'Execution transaction',
				items: [
					{
						label: 'executed Hedera transaction when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaSchedule>
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
	entityType={EntityType.HederaSchedule}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
