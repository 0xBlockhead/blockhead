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
				label: 'connection id',
			},
			{
				label: 'network',
			},
			{
				label: 'account',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'connection id',
					},
					{
						label: 'network',
					},
					{
						label: 'account',
					},
					{
						label: 'account kind',
					},
					{
						label: 'latest balance',
					},
					{
						label: 'allowance address',
					},
					{
						label: 'signature key address',
					},
					{
						label: 'key-ring ref count',
					},
					{
						label: 'pending transaction count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'State observations',
					items: [
						{
							label: 'timestamped account-state observations',
						},
					],
				},
				{
					label: 'Pending transactions',
					items: [
						{
							label: 'connected-node pending transaction rows',
						},
					],
				},
				{
					label: 'Account',
					items: [
						{
							label: 'public Quilibrium account when resolved',
						},
					],
				},
				{
					label: 'Connected node',
					items: [
						{
							label: 'parent Quilibrium node state',
						},
					],
				},
				{
					label: 'Request authority',
					items: [
						{
							label: 'allowance/signature/key-ring metadata with sensitive material redacted',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadQuilibriumAccountState>
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
	entityType={EntityType.BlockheadQuilibriumAccountState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
